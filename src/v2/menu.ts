import { Pixel } from "./coords";

interface tempI {
  i: number;
  text: string;
}

export const waitForMenuSelection = async (
  scene: Phaser.Scene,
  pixel: Pixel,
  options: string[]
) => {
  console.log("Menu will display:", options);
  const items = options.map((text, i) => {
    const btn = scene.add
      .text(pixel.x, pixel.y + i * 28, text, {
        fontFamily: "Verdana, sans-serif",
        fontSize: 25,
        fill: "#0f0",
      })
      .setInteractive();

    const promise = new Promise<tempI>((resolve) => {
      btn.once("pointerdown", () => resolve({ text: text, i: i }));
    });

    return { btn, promise };
  });

  const promises: Promise<tempI>[] = items.map((item) => item.promise);

  const result = await Promise.race<tempI>(promises);

  console.log(`clicked: ${result.i}, ${result.text}`);

  items.forEach((item) => item.btn.destroy());

  return result;
};
