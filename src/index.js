import pencil from "./Pencil";
import pencilControls from "./PencilControls";
import resizer from "./Resizer";
import introPanel from "./IntroPanel";
import animationController from "./AnimationController";
import textAliveAdapter from "./TextAliveAdapter";

pencil.initForElement(document.getElementById('tabletMask'));
pencilControls.init();
const player = textAliveAdapter.init();
introPanel.init(player);
animationController.init(player);
resizer.init(document.getElementById("tabletContainer"));
window.addEventListener("resize", () => resizer.resizeCanvas());
window.addEventListener("load", () => resizer.resizeCanvas());