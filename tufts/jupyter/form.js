document.addEventListener("DOMContentLoaded", () => {
  /* ----------------------------
  * Inject custom CSS for Jupyter icon selector
  * ---------------------------- */
  function injectJupyterIconStyles() {
    const css = `
      /* Main wrapper */
      .jupyter-mode-wrapper {
          display: block;
          padding-top: 8px;
      }
      
      /* Ensure question label is full width, above icons */
      .jupyter-mode-wrapper > .form-label,
      .jupyter-mode-wrapper > label.form-label {
        display: block;
        width: 100%;
        margin-bottom: 12px;
        text-align: left;
        font-weight: 600;
      }
      
      /* Row for icons side by side, left aligned */
      .jupyter-mode-options-row {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        gap: 32px;
        align-items: flex-start;
      }
      
      /* Each option: icon above radio */
      .jupyter-mode-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        margin: 0;
        position: relative;
        background: white;
        border: 3px solid #e5e7eb;
        border-radius: 12px;
        justify-content: center;
        cursor: pointer;
        width: 110px;
        height: 110px;
        padding-bottom: 8px;
      }
      
      .jupyter-mode-option .form-check-label {
        order: -1;
        display: flex;
        flex-direction: column; 
        align-items: center;
        cursor: pointer;
        justify-content: center;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        gap: 4px;
      }
      
      /* Icon styling */
      .jupyter-mode-option .img_icon {
        width: 50px;
        height: 50px;
        object-fit: contain;
        display: block;
        border-radius: 8px;
        cursor: pointer;
        margin-bottom: 0px;
      }
      
      /* Hide the original text inside the label */
      .jupyter-mode-option .form-check-label span {
        display: none;
      }
      
      .jupyter-mode-option .form-check-label::after {
        content: attr(data-label);
        font-size: 13px;
        font-weight: 500;
        color: #374151;
        text-align: center;
        margin-top: 4px;
        display: block;
        width: 100%;
      }
      
      /* Radio input below each icon (if visible) */
      .jupyter-mode-option input[type="radio"] {
        margin-top: 4px;
        transform: scale(1.2);
        cursor: pointer;
        z-index: 10;
      }
      
      /* Hover effects */
      .jupyter-mode-option:hover {
        border-color: #3babf6;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      /* Selected state */
      .jupyter-mode-option.selected {
        border-color: skyblue;
        background: #3babf6;
        color: white;
      }
      
      .jupyter-mode-option.selected .img_icon {
        filter: brightness(1.1);
      }
      
      .jupyter-mode-option.selected .form-check-label::after {
        color: white;
      }
      
      /* Hide radios, but keep them accessible via keyboard (I could just display:none; this) */
      .jupyter-mode-wrapper.hide-radios .jupyter-mode-option input[type="radio"] {
        position: absolute !important;
        left: -9999px !important;
        width: 1px !important;
        height: 1px !important;
        overflow: hidden !important;
        clip: rect(1px, 1px, 1px, 1px) !important;
      }
    `;

    // Create a style element and inject the CSS
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  injectJupyterIconStyles();

  /* ----------------------------
  * Jupyter image selector logic
  * ---------------------------- */
  const radios = Array.from(document.querySelectorAll('input[name="batch_connect_session_context[mode]"]'));
  if (!radios.length) return;

  const wrapper = radios[0].closest(".mb-3");
  if (!wrapper) return;

  wrapper.classList.add("jupyter-mode-wrapper", "hide-radios");

  let row = wrapper.querySelector(".jupyter-mode-options-row");
  if (!row) {
    row = document.createElement("div");
    row.className = "jupyter-mode-options-row";

    const labelEl = wrapper.querySelector(".form-label, label.form-label");
    if (labelEl && labelEl.nextSibling) {
      labelEl.parentNode.insertBefore(row, labelEl.nextSibling);
    } else {
      wrapper.appendChild(row);
    }
  }

  const optionEls = [];
  radios.forEach(radio => {
    const fc = radio.closest(".form-check");
    if (!fc) return;
    
    fc.classList.add("jupyter-mode-option");
    row.appendChild(fc);
    
    const label = fc.querySelector(".form-check-label");
    if (label) {
      let imgSrc, labelText;
      const originalText = label.innerHTML;
      
      if (radio.value === "1") {
        imgSrc = "https://user-images.githubusercontent.com/7244206/224844987-30e9b7c5-abb1-416d-9e3d-63dc8ce9d532.png";
        labelText = "Jupyter Lab";
      } else {
        imgSrc = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Jupyter_logo.svg/1280px-Jupyter_logo.svg.png";
        labelText = "Jupyter Notebook";
      }
      
      // Set data-label and inject image + original text (hidden span)
      label.setAttribute("data-label", labelText);
      label.innerHTML = `<img src="${imgSrc}" alt="${labelText}" class="img_icon"><span>${originalText}</span>`;
      
      label.addEventListener("click", (e) => {
        e.preventDefault();
        if (!radio.checked) {
          radio.checked = true;
          radio.dispatchEvent(new Event("change", { bubbles: true }));
        }
        updateSelection();
      });
    }
    
    fc.addEventListener("click", (e) => {
      if (e.target.closest("label") === fc.querySelector("label")) return;
      if (e.target === radio) return;
      
      e.preventDefault();
      if (!radio.checked) {
        radio.checked = true;
        radio.dispatchEvent(new Event("change", { bubbles: true }));
      }
      updateSelection();
    });
    
    optionEls.push({ radio, el: fc });
  });

  function updateSelection() {
    optionEls.forEach(({ radio, el }) => {
      if (radio.checked) {
        el.classList.add("selected");
      } else {
        el.classList.remove("selected");
      }
    });
  }

  updateSelection();

  radios.forEach(radio => {
    radio.addEventListener("change", updateSelection);
  });
});
