import React, { useRef, useState, useEffect } from "react";
import "./BirthdayBanner.css"; // CSS आयात करा

const BirthdayBanner = () => {
  const canvasRef = useRef(null);
  const [yourName, setYourName] = useState("");
  const [birthdayName, setBirthdayName] = useState("");
  const [yourPhoto, setYourPhoto] = useState(null); // Base64 string
  const [birthdayPhoto, setBirthdayPhoto] = useState(null); // Base64 string

  // पार्श्वभूमी
  const [selectedBackground, setSelectedBackground] = useState("banner-template-6.jpg");
  const [uploadedBackground, setUploadedBackground] = useState(null);

  // शुभेच्छा ओळी
  const [textOption, setTextOption] = useState("default"); // default किंवा custom
  const [customLines, setCustomLines] = useState("");
  const defaultLines = [
    "सोनेरी सूर्याची सोनेरी किरणे",
    "सोनेरी किरणांचा सोनेरी दिवस",
    "सोनेरी वाढदिवसाच्या सोनेरी शुभेच्छा",
    "केवळ सोन्यासारख्या लोकांना..."
  ];

  // उपशीर्षक (Subtext)
  const [subtextOption, setSubtextOption] = useState("default"); // default किंवा custom
  const [customSubtext, setCustomSubtext] = useState("");
  const defaultSubtext = ["आपणांस या जन्मदिनी", "दिर्घायुष्याच्या अनंत शुभेच्छा!"];

  // Helper function to read image as Base64
  const readImageFile = (file, setter) => {
    const reader = new FileReader();
    reader.onload = (e) => setter(e.target.result);
    reader.readAsDataURL(file);
  };

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

      // वर डावीकडे वॉटरमार्क
      ctx.font = "16px Poppins";
      ctx.fillStyle = "#f3f2eeff";
      ctx.textAlign = "left";
      ctx.fillText("Created With: LakhoriVeer", 20, 30);

      // शीर्षक (Birthday Person चं नाव)
      ctx.font = "bold 40px Poppins";
      ctx.fillStyle = "#FFD700";
      ctx.textAlign = "center";
      ctx.fillText(birthdayName, 600, 150);

      // उपशीर्षक (Default / Custom)
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

      // वाढदिवस व्यक्तीचा फोटो (डावीकडे चौकोन)
      if (birthdayPhoto) {
        const bp = new Image();
        bp.src = birthdayPhoto;
        bp.onload = () => ctx.drawImage(bp, 80, 120, 220, 250);
      } else {
        ctx.strokeStyle = "#fff";
        ctx.strokeRect(80, 120, 220, 250);
      }

      // तुमचा फोटो (उजवीकडे खाली गोल)
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

      // शुभेच्छा (Default / Custom)
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
          .catch((err) => console.log("शेअर रद्द:", err));
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
        <button onClick={downloadBanner}>⬇️ बॅनर डाउनलोड करा</button>
        <button onClick={shareOnWhatsApp}>📲 WhatsApp वर शेअर करा</button>
      </div>
      <br />
      <div className="inputs-container">
        <input
          type="text"
          placeholder="तुमचं नाव लिहा"
          value={yourName}
          onChange={(e) => setYourName(e.target.value)}
        />
        <input
          type="text"
          placeholder="वाढदिवस व्यक्तीचं नाव लिहा"
          value={birthdayName}
          onChange={(e) => setBirthdayName(e.target.value)}
        />
      </div>

      {/* पार्श्वभूमी निवड */}
      <div className="background-selection">
        <label>
          पार्श्वभूमी निवडा:
          <select
            value={selectedBackground}
            onChange={(e) => {
              setSelectedBackground(e.target.value);
              setUploadedBackground(null); // अपलोड केलेलं रिसेट करा
            }}
          >
            <option value="banner-template.jpg">पार्श्वभूमी १</option>
            <option value="banner-template-2.jpg">पार्श्वभूमी २</option>
            <option value="banner-template-3.jpg">पार्श्वभूमी ३</option>
            <option value="banner-template-4.jpg">पार्श्वभूमी 4</option>
            <option value="banner-template-5.jpg">पार्श्वभूमी 5</option>
            <option value="banner-template-6.jpg">पार्श्वभूमी 6</option>
            <option value="banner-template-7.jpg">पार्श्वभूमी 7</option>
          </select>
        </label>
        <label>
          किंवा पार्श्वभूमी अपलोड करा:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setUploadedBackground(e.target.files[0])}
          />
        </label>
      </div>

      <div className="file-inputs">
        <label>
          तुमचा फोटो:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => readImageFile(e.target.files[0], setYourPhoto)}
          />
        </label>
        <label>
          वाढदिवस व्यक्तीचा फोटो:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => readImageFile(e.target.files[0], setBirthdayPhoto)}
          />
        </label>
      </div>

      {/* उपशीर्षक (Subtext) */}
      <div className="subtext-option">
        <label>
          <input
            type="radio"
            value="default"
            checked={subtextOption === "default"}
            onChange={(e) => setSubtextOption(e.target.value)}
          />
          डिफॉल्ट उपशीर्षक
        </label>
        <label>
          <input
            type="radio"
            value="custom"
            checked={subtextOption === "custom"}
            onChange={(e) => setSubtextOption(e.target.value)}
          />
          स्वतःचं उपशीर्षक
        </label>
        {subtextOption === "custom" && (
          <textarea
            rows={2}
            placeholder="तुमचं उपशीर्षक येथे लिहा..."
            value={customSubtext}
            onChange={(e) => setCustomSubtext(e.target.value)}
            style={{ width: "100%", marginTop: "8px", padding: "8px", borderRadius: "6px" }}
          />
        )}
      </div>

      {/* शुभेच्छा */}
      <div className="text-option">
        <label>
          <input
            type="radio"
            value="default"
            checked={textOption === "default"}
            onChange={(e) => setTextOption(e.target.value)}
          />
          डिफॉल्ट शुभेच्छा
        </label>
        <label>
          <input
            type="radio"
            value="custom"
            checked={textOption === "custom"}
            onChange={(e) => setTextOption(e.target.value)}
          />
          स्वतःच्या शुभेच्छा
        </label>
        {textOption === "custom" && (
          <textarea
            rows={4}
            placeholder="तुमच्या शुभेच्छा येथे लिहा..."
            value={customLines}
            onChange={(e) => setCustomLines(e.target.value)}
            style={{ width: "100%", marginTop: "8px", padding: "8px", borderRadius: "6px" }}
          />
        )}
      </div>
    </section>
  );
};

export default BirthdayBanner;
