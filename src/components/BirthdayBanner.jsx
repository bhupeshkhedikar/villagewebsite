import React, { useRef, useState, useEffect } from "react";
import "./BirthdayBanner.css";

const BirthdayBanner = () => {
  const canvasRef = useRef(null);
  const [yourName, setYourName] = useState("");
  const [birthdayName, setBirthdayName] = useState("");
  const [yourPhoto, setYourPhoto] = useState(null);
  const [birthdayPhoto, setBirthdayPhoto] = useState(null);

  // Background
  const [selectedBackground, setSelectedBackground] = useState("banner-template-6.jpg");
  const [uploadedBackground, setUploadedBackground] = useState(null);

  // Wishes
  const [textOption, setTextOption] = useState("default");
  const [customLines, setCustomLines] = useState("");
  const defaultLines = [
    "सोनेरी सूर्याची सोनेरी किरणे",
    "सोनेरी किरणांचा सोनेरी दिवस",
    "सोनेरी वाढदिवसाच्या सोनेरी शुभेच्छा",
    "केवळ सोन्यासारख्या लोकांना..."
  ];

  // Subtext
  const [subtextOption, setSubtextOption] = useState("default");
  const [customSubtext, setCustomSubtext] = useState("dafault");
  const defaultSubtext = ["आपणांस या जन्मदिनी", "दिर्घायुष्याच्या अनंत शुभेच्छा!"];

  // Read file as Base64
  const readImageFile = (file, setter) => {
    const reader = new FileReader();
    reader.onload = (e) => setter(e.target.result);
    reader.readAsDataURL(file);
  };

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const background = new Image();
    background.src = uploadedBackground
      ? URL.createObjectURL(uploadedBackground)
      : process.env.PUBLIC_URL + "/" + selectedBackground;

    background.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Watermark
      ctx.font = "16px Poppins";
      ctx.fillStyle = "#f3f2ee";
      ctx.textAlign = "left";
      ctx.fillText("Created With: LakhoriVeer", 20, 30);

      // Title
      ctx.font = "bold 40px Poppins";
      ctx.fillStyle = "#FFD700";
      ctx.textAlign = "center";
      ctx.fillText(birthdayName, 600, 150);

      // Subtext
      ctx.font = "24px Poppins";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      const subtextLines =
        subtextOption === "default"
          ? defaultSubtext
          : customSubtext.split("\n").filter((line) => line.trim() !== "");
      subtextLines.forEach((line, index) => {
        ctx.fillText(line, 600, 200 + index * 30);
      });

      // Birthday Person photo
      if (birthdayPhoto) {
        const bp = new Image();
        bp.src = birthdayPhoto;
        bp.onload = () => ctx.drawImage(bp, 80, 120, 220, 250);
      } else {
        ctx.strokeStyle = "#fff";
        ctx.strokeRect(80, 120, 220, 250);
      }

      // Your photo
      if (yourPhoto) {
        const yp = new Image();
        yp.src = yourPhoto;
        yp.onload = () => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(660, 370, 100, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(yp, 560, 270, 200, 200);
          ctx.restore();
        };
      } else {
        ctx.strokeStyle = "#fff";
        ctx.beginPath();
        ctx.arc(660, 370, 100, 0, Math.PI * 2, true);
        ctx.stroke();
      }

      // Wishes
      ctx.font = "20px Poppins";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "left";
      const linesToDraw =
        textOption === "default"
          ? defaultLines
          : customLines.split("\n").filter((line) => line.trim() !== "");
      linesToDraw.forEach((line, index) => {
        ctx.fillText(line, 70, 420 + index * 30);
      });

      // शुभेच्छुक
      ctx.font = "bold 28px Poppins";
      ctx.fillStyle = "yellow";
      ctx.textAlign = "center";
      ctx.fillText(`शुभेच्छुक : ${yourName}`, 400, 560);
    };
  }, [
    yourName,
    birthdayName,
    yourPhoto,
    birthdayPhoto,
    textOption,
    customLines,
    subtextOption,
    customSubtext,
    selectedBackground,
    uploadedBackground
  ]);

  const downloadBanner = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "birthday-banner.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const shareOnWhatsApp = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      const file = new File([blob], "birthday-banner.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator
          .share({
            title: "🎉 वाढदिवस शुभेच्छा 🎉",
            text: `🎂 ${birthdayName} ला खास वाढदिवसाच्या हार्दिक शुभेच्छा!  
शुभेच्छुक: ${yourName} 💐`,
            files: [file],
          })
          .catch(() => {});
      } else {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
          `🎂 ${birthdayName} ला खास वाढदिवसाच्या शुभेच्छा! 🎉  
शुभेच्छुक: ${yourName} 💐`
        )}`;
        window.open(whatsappUrl, "_blank");
      }
    });
  };

  return (
    <section className="birthday-banner">
      <h2>🎉 वाढदिवसाचं खास बॅनर 🎉</h2>

      <canvas ref={canvasRef} width={800} height={600} />

      <div className="button-group">
        <button className="btn primary" onClick={downloadBanner}>⬇️ बॅनर डाउनलोड</button>
        <button className="btn whatsapp" onClick={shareOnWhatsApp}>📲 WhatsApp शेअर</button>
      </div>

      {/* Inputs */}
      <div className="inputs-container">
        <input
          type="text"
          placeholder="तुमचं नाव"
          value={yourName}
          onChange={(e) => setYourName(e.target.value)}
        />
        <input
          type="text"
          placeholder="वाढदिवस व्यक्तीचं नाव"
          value={birthdayName}
          onChange={(e) => setBirthdayName(e.target.value)}
        />
      </div>

      {/* Background */}
      <div className="styled-box">
        <label>🎨 पार्श्वभूमी निवडा</label>
        <select
          value={selectedBackground}
          onChange={(e) => {
            setSelectedBackground(e.target.value);
            setUploadedBackground(null);
          }}
        >
          <option value="banner-template.jpg">पार्श्वभूमी १</option>
          <option value="banner-template-2.jpg">पार्श्वभूमी २</option>
          <option value="banner-template-3.jpg">पार्श्वभूमी ३</option>
          <option value="banner-template-4.jpg">पार्श्वभूमी ४</option>
          <option value="banner-template-5.jpg">पार्श्वभूमी ५</option>
          <option value="banner-template-6.jpg">पार्श्वभूमी ६</option>
          <option value="banner-template-7.jpg">पार्श्वभूमी ७</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setUploadedBackground(e.target.files[0])}
        />
      </div>

      {/* File uploads */}
      <div className="file-inputs">
        <label className="file-label">
          📷 तुमचा फोटो
          <input
            type="file"
            accept="image/*"
            onChange={(e) => readImageFile(e.target.files[0], setYourPhoto)}
          />
        </label>
        <label className="file-label">
          🎂 वाढदिवस व्यक्तीचा फोटो
          <input
            type="file"
            accept="image/*"
            onChange={(e) => readImageFile(e.target.files[0], setBirthdayPhoto)}
          />
        </label>
      </div>

      {/* Subtext */}
      <div className="styled-box">
        <p>📝 उपशीर्षक निवडा</p>
        <label className="radio">
          <input
            type="radio"
            value="default"
            checked={subtextOption === "default"}
            onChange={(e) => setSubtextOption(e.target.value)}
          />
          डिफॉल्ट
        </label>
        <label className="radio">
          <input
            type="radio"
            value="custom"
            checked={subtextOption === "custom"}
            onChange={(e) => setSubtextOption(e.target.value)}
          />
          स्वतःचं
        </label>
        {subtextOption === "custom" && (
          <textarea
            rows={2}
            placeholder="तुमचं उपशीर्षक लिहा..."
            value={customSubtext}
            onChange={(e) => setCustomSubtext(e.target.value)}
          />
        )}
      </div>

      {/* Wishes */}
      <div className="styled-box">
        <p>💐 शुभेच्छा निवडा</p>
        <label className="radio">
          <input
            type="radio"
            value="default"
            checked={textOption === "default"}
            onChange={(e) => setTextOption(e.target.value)}
          />
          डिफॉल्ट
        </label>
        <label className="radio">
          <input
            type="radio"
            value="custom"
            checked={textOption === "custom"}
            onChange={(e) => setTextOption(e.target.value)}
          />
          स्वतःच्या
        </label>
        {textOption === "custom" && (
          <textarea
            rows={4}
            placeholder="तुमच्या शुभेच्छा लिहा..."
            value={customLines}
            onChange={(e) => setCustomLines(e.target.value)}
          />
        )}
      </div>
    </section>
  );
};

export default BirthdayBanner;
