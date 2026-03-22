declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: () => void;
      };
    };
  }
}

let twitterScriptPromise: Promise<void> | null = null;

function injectTwitterScript() {
  if (twitterScriptPromise) {
    return twitterScriptPromise;
  }

  twitterScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-twitter-widgets="true"]'
    );

    if (existingScript) {
      if (window.twttr?.widgets) {
        resolve();
        return;
      }

      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () =>
          reject(
            new Error("Twitter embeds were blocked by your browser or extension.")
          ),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.charset = "utf-8";
    script.src = "https://platform.twitter.com/widgets.js";
    script.dataset.twitterWidgets = "true";
    script.onload = () => resolve();
    script.onerror = () =>
      reject(
        new Error("Twitter embeds were blocked by your browser or extension.")
      );

    document.body.appendChild(script);
  });

  return twitterScriptPromise;
}

export async function renderTwitterWidgets() {
  try {
    if (!window.twttr?.widgets) {
      await injectTwitterScript();
    }

    window.twttr?.widgets?.load();
  } catch (error) {
    console.error(error);
  }
}

