package main

import (
	"archive/zip"
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"encoding/json"
	"fmt"
	"io"
	"runtime/debug"
	"strings"
	"syscall/js"
)

type cfb8 struct {
	b         cipher.Block
	out       []byte
	decrypt   bool
	sr        []byte
}

func (x *cfb8) XORKeyStream(dst, src []byte, report func(int64), processChunk int64) {
	var processedThisChunk int64
	for i := range src {
		x.b.Encrypt(x.out, x.sr)
		val := src[i] ^ x.out[0]

		copy(x.sr, x.sr[1:])
		if x.decrypt {
			x.sr[15] = src[i]
		} else {
			x.sr[15] = val
		}
		dst[i] = val

		processedThisChunk++
		if processedThisChunk >= processChunk && report != nil {
			report(processedThisChunk)
			processedThisChunk = 0
		}
	}
	if processedThisChunk > 0 && report != nil {
		report(processedThisChunk)
	}
}

func newCFB8(block cipher.Block, iv []byte, decrypt bool) *cfb8 {
	x := &cfb8{
		b:       block,
		out:     make([]byte, block.BlockSize()),
		sr:      make([]byte, block.BlockSize()),
		decrypt: decrypt,
	}
	copy(x.sr, iv)
	return x
}

func encrypt(this js.Value, args []js.Value) interface{} {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Panic:", r, string(debug.Stack()))
		}
	}()

	inputArray := args[0]
	keyStr := args[1].String()

	if len(keyStr) != 32 {
		return nil
	}

	key := []byte(keyStr)
	iv := key[:16]

	inputLen := inputArray.Length()
	inputBytes := make([]byte, inputLen)
	js.CopyBytesToGo(inputBytes, inputArray)

	zipReader, err := zip.NewReader(bytes.NewReader(inputBytes), int64(inputLen))
	if err != nil {
		fmt.Println("Error reading input zip:", err)
		return nil
	}

	progressCb := js.Global().Get("goProgressCallback")

	// Precalculate total bytes for accurate smooth progress bar
	var totalUncompressedBytes int64
	for _, f := range zipReader.File {
		if !f.FileInfo().IsDir() && f.Name != "contents.json" {
			size := f.UncompressedSize64
			if size == 0 {
				size = uint64(f.FileInfo().Size())
			}
			totalUncompressedBytes += int64(size)
		}
	}
	if totalUncompressedBytes == 0 {
		totalUncompressedBytes = int64(inputLen)
	}

	buf := new(bytes.Buffer)
	zipWriter := zip.NewWriter(buf)

	entriesMetadata := make(map[string]string)
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil
	}

	var bytesProcessed int64
	lastPercent := -1

	reportProgress := func(increment int64) {
		bytesProcessed += increment
		if totalUncompressedBytes > 0 {
			percent := int((float64(bytesProcessed) / float64(totalUncompressedBytes)) * 100)
			if percent != lastPercent && percent <= 100 {
				if progressCb.Type() == js.TypeFunction {
					progressCb.Invoke(percent)
				}
				lastPercent = percent
			}
		}
	}

	for _, file := range zipReader.File {
		if file.FileInfo().IsDir() {
			zipWriter.Create(file.Name)
			continue
		}
		if file.Name == "contents.json" {
			continue
		}

		fc, err := file.Open()
		if err != nil {
			return nil
		}
		data, err := io.ReadAll(fc)
		fc.Close()
		if err != nil {
			return nil
		}

		stream := newCFB8(block, iv, false)
		encryptedData := make([]byte, len(data))
		
		stream.XORKeyStream(encryptedData, data, reportProgress, 131072) // report every 128KB 

		w, err := zipWriter.Create(file.Name)
		if err != nil {
			return nil
		}
		w.Write(encryptedData)

		entriesMetadata[file.Name] = keyStr
	}

	packContents := struct {
		Version int                 `json:"version"`
		Content []map[string]string `json:"content"`
	}{
		Version: 1,
	}

	for path := range entriesMetadata {
		packContents.Content = append(packContents.Content, map[string]string{
			"path": path,
			"key":  keyStr,
		})
	}

	jsonBytes, err := json.MarshalIndent(packContents, "", "  ")
	if err == nil {
		w, _ := zipWriter.Create("contents.json")
		w.Write(jsonBytes)
	}

	err = zipWriter.Close()
	if err != nil {
		return nil
	}

	outBytes := buf.Bytes()
	jsOut := js.Global().Get("Uint8Array").New(len(outBytes))
	js.CopyBytesToJS(jsOut, outBytes)

	if progressCb.Type() == js.TypeFunction {
		progressCb.Invoke(100)
	}

	return jsOut
}

func decrypt(this js.Value, args []js.Value) interface{} {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Panic:", r, string(debug.Stack()))
		}
	}()

	inputArray := args[0]
	keyStr := args[1].String()

	if len(keyStr) != 32 {
		return nil
	}

	key := []byte(keyStr)
	iv := key[:16]

	inputLen := inputArray.Length()
	inputBytes := make([]byte, inputLen)
	js.CopyBytesToGo(inputBytes, inputArray)

	zipReader, err := zip.NewReader(bytes.NewReader(inputBytes), int64(inputLen))
	if err != nil {
		return nil
	}

	var contentsFile *zip.File
	for _, file := range zipReader.File {
		if file.Name == "contents.json" {
			contentsFile = file
			break
		}
	}

	if contentsFile == nil {
		fmt.Println("No contents.json found")
		return nil
	}

	fc, err := contentsFile.Open()
	if err != nil {
		return nil
	}
	contentsData, err := io.ReadAll(fc)
	fc.Close()

	var packContents struct {
		Content []map[string]string `json:"content"`
	}
	json.Unmarshal(contentsData, &packContents)

	encryptedPaths := make(map[string]bool)
	for _, entry := range packContents.Content {
		if p, ok := entry["path"]; ok {
			encryptedPaths[p] = true
			// also normalize slashes just in case
			encryptedPaths[strings.ReplaceAll(p, "\\", "/")] = true
		}
	}

	var totalUncompressedBytes int64
	for _, f := range zipReader.File {
		if !f.FileInfo().IsDir() && f.Name != "contents.json" {
			size := f.UncompressedSize64
			if size == 0 {
				size = uint64(f.FileInfo().Size())
			}
			totalUncompressedBytes += int64(size)
		}
	}
	if totalUncompressedBytes == 0 {
		totalUncompressedBytes = int64(inputLen)
	}

	progressCb := js.Global().Get("goProgressCallback")
	var bytesProcessed int64
	lastPercent := -1

	reportProgress := func(increment int64) {
		bytesProcessed += increment
		if totalUncompressedBytes > 0 {
			percent := int((float64(bytesProcessed) / float64(totalUncompressedBytes)) * 100)
			if percent != lastPercent && percent <= 100 {
				if progressCb.Type() == js.TypeFunction {
					progressCb.Invoke(percent)
				}
				lastPercent = percent
			}
		}
	}

	buf := new(bytes.Buffer)
	zipWriter := zip.NewWriter(buf)

	block, err := aes.NewCipher(key)
	if err != nil {
		return nil
	}

	for _, file := range zipReader.File {
		if file.Name == "contents.json" || file.FileInfo().IsDir() {
			if file.FileInfo().IsDir() {
				zipWriter.Create(file.Name)
			}
			continue
		}

		fc, err := file.Open()
		if err != nil {
			return nil
		}
		data, err := io.ReadAll(fc)
		fc.Close()

		w, err := zipWriter.Create(file.Name)
		if err != nil {
			return nil
		}

		cleanPath := strings.ReplaceAll(file.Name, "\\", "/")
		if encryptedPaths[cleanPath] || encryptedPaths[strings.TrimPrefix(cleanPath, "/")] {
			stream := newCFB8(block, iv, true)
			decryptedData := make([]byte, len(data))
			stream.XORKeyStream(decryptedData, data, reportProgress, 131072)
			w.Write(decryptedData)
		} else {
			reportProgress(int64(len(data)))
			w.Write(data)
		}
	}

	err = zipWriter.Close()
	if err != nil {
		return nil
	}

	outBytes := buf.Bytes()
	jsOut := js.Global().Get("Uint8Array").New(len(outBytes))
	js.CopyBytesToJS(jsOut, outBytes)

	if progressCb.Type() == js.TypeFunction {
		progressCb.Invoke(100)
	}

	return jsOut
}

func main() {
	c := make(chan struct{}, 0)
	js.Global().Set("goEncrypt", js.FuncOf(encrypt))
	js.Global().Set("goDecrypt", js.FuncOf(decrypt))
	<-c
}
