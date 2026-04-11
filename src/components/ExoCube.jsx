import '../styles/exocube.css';

export default function ExoCube() {
  return (
    <>
      <div className="exo-panorama-wrapper">
        <div className="exo-panorama-cube">
          <div className="exo-face face-front" style={{ backgroundImage: 'url(/panorama/panorama_0.png)' }} />
          <div className="exo-face face-right" style={{ backgroundImage: 'url(/panorama/panorama_1.png)' }} />
          <div className="exo-face face-back" style={{ backgroundImage: 'url(/panorama/panorama_2.png)' }} />
          <div className="exo-face face-left" style={{ backgroundImage: 'url(/panorama/panorama_3.png)' }} />
          <div className="exo-face face-top" style={{ backgroundImage: 'url(/panorama/panorama_4.png)' }} />
          <div className="exo-face face-bottom" style={{ backgroundImage: 'url(/panorama/panorama_5.png)' }} />
        </div>
      </div>
      <div className="vignette-overlay" />
    </>
  );
}
