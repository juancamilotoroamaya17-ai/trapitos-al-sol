import { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import './Verdict.css';

export const Verdict = ({ onNavigate, stats = {} }) => {
  const { matches = 0, differences = 0, openTexts = 0 } = stats;
  const [result, setResult] = useState(null);
  const [shareStatus, setShareStatus] = useState("Compartir resultado 📱");
  const [shareFile, setShareFile] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    // LÓGICA DE RESULTADO
    let type = 'conexion_suave';
    
    const totalAnswers = matches + differences;
    const matchRatio = totalAnswers > 0 ? (matches / totalAnswers) : 0;
    
    if (matchRatio >= 0.7 || openTexts >= 15) {
       type = 'alta_quimica';
    } else if (matchRatio < 0.35) {
       type = 'caos_interesante';
    } else if (matchRatio >= 0.35 && matchRatio <= 0.65) {
       type = 'interes_mixto';
    } else {
       type = 'conexion_suave';
    }

    // El objeto de configuración
    const configurations = {
      'alta_quimica': {
         title: "🔥 Hay tensión real aquí… esto no es casualidad",
         desc: "Demasiadas coincidencias y respuestas profundas. La química es evidente, es hora de dejar de hacerse los locos.",
         colorClass: "verdict-high-chem"
      },
      'interes_mixto': {
         title: "👀 Hay curiosidad… pero alguien se está guardando algo",
         desc: "No todo es transparencia. Existen diferencias que generan roce, pero un roce que definitivamente mantiene el misterio.",
         colorClass: "verdict-mixed"
      },
      'caos_interesante': {
         title: "🌪️ No están en la misma página… y eso lo hace peligroso",
         desc: "Tienen visiones que chocan bruscamente. Cero zona de confort. Pero a veces, los polos opuestos son los que más arden.",
         colorClass: "verdict-chaos"
      },
      'conexion_suave': {
         title: "💫 Hay algo tranquilo aquí… puede crecer o desaparecer",
         desc: "Un terreno neutral. Hubo sinceridad, pero sin tanto riesgo. La base está puesta, ahora depende de ustedes si aprietan el acelerador.",
         colorClass: "verdict-soft"
      }
    };

    setResult(configurations[type]);
  }, [matches, differences, openTexts]);

  // Pre-generar la imagen silenciosamente después de que acaben las animaciones
  useEffect(() => {
    if (!result || !cardRef.current) return;
    
    const timer = setTimeout(() => {
      html2canvas(cardRef.current, {
        backgroundColor: '#0a0508',
        scale: 2
      }).then(canvas => {
        canvas.toBlob(blob => {
          if (blob) {
            const f = new File([blob], 'veredicto-trapitos.png', { type: 'image/png' });
            setShareFile(f);
            console.log("Visual del veredicto pre-generado y listo.");
          }
        }, 'image/png');
      }).catch(err => console.error("Error pre-generando canvas", err));
    }, 1500); // 1.5s para asegurar que todas las animaciones (delay-5) terminaron

    return () => clearTimeout(timer);
  }, [result]);

  const handleShare = async () => {
    if (!result) return;
    
    const shareLink = window.location.hostname === 'localhost' ? 'https://trapitosalsol.app' : window.location.origin;
    const shareText = `🔥 Nos salió esto en Trapitos al Sol...\n\n👀 ${result.title}\n\n😳 ${matches} coincidencias / ${differences} diferencias\n\n¿Tú qué crees?\n\n👉 Juega aquí: ${shareLink}`;
    console.log("Intentando compartir...");

    // Ejecutar inmediatamente para evitar perder el "User Activation" de los móviles (Safari)
    if (shareFile && navigator.canShare && navigator.canShare({ files: [shareFile] })) {
      try {
        await navigator.share({
          title: 'Trapitos al Sol',
          text: shareText,
          files: [shareFile]
        });
        console.log("Compartido con éxito (Imagen + Texto)");
        setShareStatus("¡Enviado! 🔥");
      } catch (error) {
        console.log("Error en share o cancelado:", error);
        fallbackCopyText(shareText, "Error nativo, texto copiado 👍");
      }
    } else {
      console.log("Web Share API con archivos no disp. Ejecutando fallback...");
      
      // Si tenemos archivo pero no soporta files, forzamos descarga
      if (shareFile) {
        const url = URL.createObjectURL(shareFile);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'veredicto-trapitos.png';
        a.click();
        URL.revokeObjectURL(url);
      } else if (navigator.share) {
         // Intento puramente textual si file falló
         try {
            await navigator.share({ title: 'Trapitos al Sol', text: shareText });
            setShareStatus("¡Enviado! 🔥");
            setTimeout(() => setShareStatus("Compartir resultado 📱"), 3500);
            return;
         } catch(e) { }
      }
      
      fallbackCopyText(shareText, "Dato guardado y copiado 🔥");
    }

    setTimeout(() => setShareStatus(shareFile ? "Compartir resultado 📱" : "Compartir (Generando visual...)"), 3500);
  };

  const fallbackCopyText = async (text, successMsg) => {
    try {
      await navigator.clipboard.writeText(text);
      setShareStatus(successMsg);
    } catch (err) {
      console.error("Fallo absoluto al copiar", err);
      setShareStatus("Oops... error copiando ❌");
    }
  };

  if (!result) return null;

  return (
    <div className={`verdict-screen fade-in ${result.colorClass}`}>
      <GlassCard className="verdict-card delay-1" ref={cardRef}>
        <Typography variant="h1" className="verdict-main-title">
          El Veredicto
        </Typography>
        
        <Typography variant="h2" className="verdict-phrase delay-2">
          {result.title}
        </Typography>
        
        <Typography variant="body" className="verdict-description delay-3">
          {result.desc}
        </Typography>

        <div className="verdict-stats delay-4">
          <div className="stat-item">
            <span className="stat-num">{matches}</span>
            <span className="stat-label">Coincidencias</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">{differences}</span>
            <span className="stat-label">Diferencias</span>
          </div>
        </div>

        <div className="verdict-actions delay-5" data-html2canvas-ignore="true">
          <Button variant="primary" onClick={() => onNavigate('home')}>
            Jugar otra vez
          </Button>
          <Button variant="secondary" className="btn-share" onClick={handleShare}>
            {shareStatus}
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};
