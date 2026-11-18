import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";

function getLanguageExtension(filePath = "") {
  const lower = filePath.toLowerCase();
  if (/\.(tsx?|jsx?)$/.test(lower)) {
    const isTS = /\.tsx?$/.test(lower);
    return javascript({ jsx: true, typescript: isTS });
  }
  if (lower.endsWith(".css")) return css();
  if (lower.endsWith(".html")) return html();
  if (/\.(json|toml)$/.test(lower)) return json();
  return javascript();
}

export function CodeEditor({ content = "", filePath = "", onChange }) {
  return (
    <div className="h-full w-full overflow-hidden bg-[#1e1e24] select-text">
      <CodeMirror
        value={content}
        height="100%"
        theme={oneDark}
        extensions={[getLanguageExtension(filePath)]}
        onChange={onChange}
        className="h-full overflow-auto text-[13px] font-mono leading-relaxed"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          foldGutter: true,
          bracketMatching: true,
          autocompletion: true,
          indentOnInput: true,
          closeBrackets: true,
          syntaxHighlighting: true,
        }}
      />
    </div>
  );
}

export default CodeEditor;

