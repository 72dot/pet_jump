import fs from "fs";
import path from "path";
import PetJumpClient from "./PetJumpClient";

export default function Home() {
  const jumpDir = path.join(process.cwd(), "public", "jump");
  let petImages: string[] = [];

  try {
    // public/jump 폴더 내의 이미지 파일(.webp, .png, .jpg, .jpeg, .gif, .svg)들만 필터링하여 수집
    petImages = fs
      .readdirSync(jumpDir)
      .filter((file) => /\.(webp|png|jpe?g|gif|svg)$/i.test(file));
  } catch (error) {
    console.error("Failed to read public/jump directory:", error);
  }

  return <PetJumpClient petImages={petImages} />;
}
