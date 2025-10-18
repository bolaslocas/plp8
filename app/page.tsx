"use client"

import { useEffect } from "react"

export default function GamePage() {
  useEffect(() => {
    // Load the game script after component mounts
    const script = document.createElement("script")
    script.src = "/game.js?cache=145"
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: Tahoma, Arial, sans-serif;
          overflow: hidden;
          background: #2f2f2f;
          -webkit-touch-callout: none !important;
          -webkit-text-size-adjust: none !important;
          -webkit-user-select: none !important;
        }
        .shadowed {
          box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.75);
        }
        #welcomeSplash {
          color: white;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #111;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100;
          flex-direction: column;
          opacity: 0;
          visibility: hidden;
          transition: opacity 1s ease;
        }
        #welcomeSplash.visible {
          opacity: 1;
          visibility: visible;
        }
        #welcomeSplash.hidden {
          opacity: 0;
          visibility: hidden;
        }
        #welcomeSplash h1 {
          font-size: 3em;
          margin: 0;
          user-select: none;
        }
        #welcomeSplash p {
          font-size: 1.2em;
          margin-top: 10px;
          user-select: none;
        }
        #overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          z-index: 0;
          opacity: 0;
          visibility: hidden;
          transition: opacity 1s ease;
        }
        body.login-mode {
          background-image: url('/bggg.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          color: white;
        }
        body.login-mode #overlay {
          opacity: 1;
          visibility: visible;
        }
        #loginContainer {
          color: white;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          background: rgba(0,0,0,0.75);
          padding: 40px 60px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 0 15px rgba(0,0,0,0.9);
          max-width: 350px;
          width: 90%;
          opacity: 0;
          visibility: hidden;
          transition: opacity 1s ease;
        }
        body.login-mode #loginContainer {
          opacity: 1;
          visibility: visible;
        }
        #loginContainer h2 {
          margin-bottom: 12px;
        }
        #loginContainer p {
          font-size: 16px;
          margin-bottom: 30px;
          line-height: 1.4;
        }
        #banMessage, #updateMessage {
          display: none;
          font-size: 20px;
          font-weight: bold;
        }
        #banMessage {
          color: #ff4444;
        }
        #updateMessage {
          color: #f0c14b;
        }
        .login-with-google-btn {
          transition: background-color 0.3s, box-shadow 0.3s;
          padding: 12px 16px 12px 42px;
          border: none;
          border-radius: 3px;
          box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.25);
          color: #757575;
          font-size: 14px;
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
          background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=);
          background-color: white;
          background-repeat: no-repeat;
          background-position: 35px 11px;
          cursor: pointer;
          width: 100%;
          text-align: center;
          justify-content: center;
        }
        .login-with-google-btn:hover {
          background-color: #e8e8e8;
        }
        #tabWarning {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 70, 70, 0.95);
          color: white;
          padding: 30px 40px;
          border-radius: 12px;
          box-shadow: 0 0 15px rgba(255, 70, 70, 0.9);
          font-size: 1.3em;
          font-weight: bold;
          text-align: center;
          z-index: 1000;
          display: none;
        }
        #tabWarning button {
          margin-top: 20px;
          padding: 8px 16px;
          font-size: 1em;
          background: white;
          color: #ff4646;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }
        #tabWarning button:hover {
          background: #ffeaea;
        }
        #wrongRotation {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.95);
          z-index: 2000;
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          text-align: center;
          padding: 20px;
          user-select: none;
        }
        #wrongRotation.visible {
          display: flex;
        }
        #wrongRotation img {
          width: 30%;
          max-width: 180px;
          margin-bottom: 20px;
        }
        #wrongRotation h1 {
          font-size: 2em;
        }
        #swagWrapper {
          width: 100%;
          height: 100%;
          padding: 0;
          margin: 0;
          position: fixed;
          background: url(/BG_Game.jpg);
          background-size: cover;
        }
        @font-face {
          font-family: 'Tahoma';
          font-style: normal;
          font-weight: 400;
          src: url('/Ubuntu-B.ttf') format('truetype');
        }
        .font_preload {
          opacity: 0;
        }
      `}</style>

      <div className="font_preload">
        <span style={{ fontFamily: "'Tahoma', Arial, sans-serif" }}></span>
      </div>

      <div id="swagWrapper" style={{ display: "none" }}></div>

      <div id="home2">
        <div id="welcomeSplash">
          <h1>Pool Live Plus</h1>
          <p>مرحباً بك! جاري التحميل ...</p>
        </div>

        <div id="overlay"></div>

        <div id="loginContainer">
          <div id="loginContent">
            <h2 id="title">مرحباً بك في Pool Live Plus</h2>
            <p id="message">يجب عليك تسجيل الدخول عبر حساب جوجل لتتمكن من اللعب والاستمتاع بالمزايا.</p>
            <button className="login-with-google-btn" id="googleLoginBtn" style={{ display: "none" }}>
              تسجيل الدخول عبر جوجل
            </button>
          </div>
          <div id="banMessage">تم حظرك</div>
          <div id="updateMessage">يرجى الانتظار قليلاً...</div>
          <span id="downloadBtn" style={{ display: "none", padding: "12px 20px", marginTop: "20px", fontSize: "16px" }}>
            تحميل اللعبة
          </span>
        </div>

        <div id="tabWarning">
          <div id="tabWarningText">اللعبة مفتوحة في تبويب آخر</div>
          <button id="closeTabWarningBtn">إغلاق</button>
        </div>
      </div>

      <div id="wrongRotation">
        <img src="/picture.png" alt="Rotate Screen" />
        <h1 id="rotateMessage">يرجى تدوير الشاشة</h1>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
          const translations = {
            ar: {
              title: "مرحباً بك في Pool Live Plus",
              message: "يجب عليك تسجيل الدخول عبر حساب جوجل لتتمكن من اللعب والاستمتاع بالمزايا.",
              btnText: "تسجيل الدخول عبر جوجل",
              banText: "تم حظرك",
              tabWarningText: "اللعبة مفتوحة في تبويب آخر",
              updateText: "يرجى الانتظار قليلاً . . .",
              rotateText: "يرجى تدوير الشاشة",
              downloadText: "تحميل اللعبة"
            },
            en: {
              title: "Welcome to Pool Live Plus",
              message: "You must sign in with Google to play and enjoy the features.",
              btnText: "Sign in with Google",
              banText: "You have been banned",
              tabWarningText: "The game already exists in tab other",
              updateText: "Please wait a little while . . .",
              downloadText: "Download Game",
              rotateText: "Please rotate your screen"
            },
            fr: {
              title: "Bienvenue à Pool Live Plus",
              message: "Vous devez vous connecter avec Google pour jouer et profiter des fonctionnalités.",
              btnText: "Se connecter avec Google",
              banText: "Vous avez été banni",
              tabWarningText: "Le jeu est déjà ouvert dans un autre onglet",
              downloadText: "Télécharger le jeu",
              updateText: "Veuillez patienter un moment . . .",
              rotateText: "Veuillez pivoter votre écran"
            }
          };

          const loadingTextsMap = {
            ar: ["جارٍ التحميل.", "جارٍ التحميل..", "جارٍ التحميل..."],
            en: ["Welcome! Loading.", "Welcome! Loading..", "Welcome! Loading..."],
            fr: ["Chargement en cours.", "Chargement en cours..", "Chargement en cours..."]
          };

          const userLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase().split('-')[0];
          const locale = translations[userLang] || translations['en'];
          const loadingTexts = loadingTextsMap[userLang] || loadingTextsMap['en'];

          document.getElementById('title').textContent = locale.title;
          document.getElementById('message').textContent = locale.message;
          document.getElementById('googleLoginBtn').textContent = locale.btnText;
          document.getElementById('banMessage').textContent = locale.banText;
          document.getElementById('tabWarningText').textContent = locale.tabWarningText;
          document.getElementById('updateMessage').textContent = locale.updateText;
          document.getElementById('rotateMessage').textContent = locale.rotateText;
          document.getElementById('downloadBtn').textContent = locale.downloadText;

          const welcomeSplash = document.getElementById('welcomeSplash');
          const loadingParagraph = welcomeSplash.querySelector('p');

          let loadingIndex = 0;
          loadingParagraph.textContent = loadingTexts[loadingIndex];

          setTimeout(() => {
            welcomeSplash.classList.add('visible');
          }, 100);

          const loadingInterval = setInterval(() => {
            loadingIndex = (loadingIndex + 1) % loadingTexts.length;
            loadingParagraph.textContent = loadingTexts[loadingIndex];
          }, 700);

          setTimeout(() => {
            welcomeSplash.classList.remove('visible');
            welcomeSplash.classList.add('hidden');
            setTimeout(() => {
              clearInterval(loadingInterval);
              document.body.classList.add('login-mode');
            }, 1000);
          }, 5100);

          function showBanMessage() {
            document.getElementById('loginContent').style.display = 'none';
            document.getElementById('updateMessage').style.display = 'none';
            const banDiv = document.getElementById('banMessage');
            banDiv.style.display = 'block';
            document.getElementById('banMessage').textContent = locale.banText;
          }

          function showUpdateMessage() {
            document.getElementById('loginContent').style.display = 'none';
            document.getElementById('banMessage').style.display = 'none';
            const updateDiv = document.getElementById('updateMessage');
            updateDiv.style.display = 'block';
            document.getElementById('updateMessage').textContent = locale.updateText;
          }

          function showGame() {
            document.getElementById('home2').style.display = 'none';
            document.getElementById('swagWrapper').style.display = '';
          }

          function hideGame() {
            document.getElementById('home2').style.display = '';
            document.getElementById('swagWrapper').style.display = 'none';
          }

          function showLogin() {
            hideGame();
            document.getElementById('title').textContent = locale.title;
            document.getElementById('message').textContent = locale.message;
            document.getElementById('googleLoginBtn').textContent = locale.btnText;
            document.getElementById('banMessage').style.display = 'none';
            document.getElementById('updateMessage').style.display = 'none';
            document.getElementById('loginContent').style.display = 'block';
          }

          function showTabWarning() {
            const tabWarn = document.getElementById('tabWarning');
            tabWarn.style.display = 'block';
            document.getElementById('tabWarningText').textContent = locale.tabWarningText;
          }

          document.getElementById('closeTabWarningBtn').addEventListener('click', () => {
            try {
              window.close();
            } catch (error) {}
            try {
              app.quit();
            } catch (error) {}
          });

          function showWrongRotation() {
            document.getElementById('wrongRotation').classList.add('visible');
            document.getElementById('rotateMessage').textContent = locale.rotateText;
          }

          function hideWrongRotation() {
            document.getElementById('wrongRotation').classList.remove('visible');
          }

          function showDownload() {
            document.getElementById('loginContainer').style.display = 'block';
            document.getElementById('downloadBtn').style.display = 'inline-block';
            document.getElementById('loginContent').style.display = 'none';
            document.getElementById('banMessage').style.display = 'none';
            document.getElementById('updateMessage').style.display = 'none';
            document.getElementById('downloadBtn').textContent = locale.downloadText;
            document.getElementById('updateMessage').textContent = "Pool Live Plus V1 For PC";
            document.getElementById('updateMessage').style.display = 'inline';
          }

          function redirectToDownload() {
            window.location.href = "https://mega.nz/file/DRVHXDqT#VR48zp2-iI8GYDBRpbGWmUpQcEHSK-QfF96MEN7g_X0";
          }

          document.getElementById('downloadBtn').addEventListener('click', redirectToDownload);

          function checkOrientation() {
            if (window.innerWidth < window.innerHeight) {
              showWrongRotation();
              document.getElementById('loginContainer').style.visibility = 'hidden';
            } else {
              hideWrongRotation();
              document.getElementById('loginContainer').style.visibility = 'visible';
            }
          }

          window.addEventListener('resize', checkOrientation);
          window.addEventListener('load', () => {
            checkOrientation();
          });

          const userAgent2 = navigator.userAgent || navigator.vendor || window.opera;
          if (/windows|mac os|linux/i.test(userAgent2)) {
            setInterval(() => {
              eval('if(Date.now.toString().length>10 || performance.now.toString().length>10||requestAnimationFrame.toString().length>15 || setInterval.toString().length>10 ||setTimeout.toString().length>10) location.reload()'.replaceAll('1', ''));
            }, 6000);
          }

          var chs = 145;
          var dxas = "";
          var awfawf = false;

          if (/MOBApp_/i.test(userAgent2)) {
            if (awfawf === false) {
              xhrloopOne2("game", function(){}, true, false);
              awfawf = true;
            }
          }

          document.addEventListener('mousemove', function(event) {
            if (awfawf === false) {
              xhrloopOne2("game", function(){}, true, false);
            }
            awfawf = true;
          });

          function xhrloopOne2(file, onload = function(){}, hide = false, cache = true) {
            let xhr = new XMLHttpRequest();
            xhr.onload = function(data) {
              var script = document.createElement("script");
              dxas += hide ? \`(function(){\${data.target.responseText}}())\` : data.target.responseText;
              script.textContent = dxas;
              document.body.appendChild(script);
              dxas = "";
              delete dxas;
              script.remove();
              onload();
            };

            if (cache !== true) {
              xhr.open('GET', "/" + file + ".js?cache=" + Date.now(), true);
              xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
              xhr.setRequestHeader("tcz", Date.now());
            } else {
              xhr.open('GET', "/" + file + ".js?cache=" + chs, true);
              xhr.setRequestHeader("tcz", Date.now());
            }
            xhr.send();
          }

          function xhrloopURLOne(file, onload = function(){}, hide = false, cache = true) {
            let xhr = new XMLHttpRequest();
            xhr.onload = function(data) {
              var script = document.createElement("script");
              dxas += hide ? \`(function(){\${data.target.responseText}}())\` : data.target.responseText;
              dxas += "\\n ";
              onload();
            };

            if (cache !== true) {
              xhr.open('GET', file + "/?cache=" + Date.now(), true);
              xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
              xhr.setRequestHeader("tcz", Date.now());
            } else {
              xhr.open('GET', file + "?cache=" + chs, true);
              xhr.setRequestHeader("tcz", Date.now());
            }
            xhr.send();
          }
        `,
        }}
      />
    </>
  )
}
