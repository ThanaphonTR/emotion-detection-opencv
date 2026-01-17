export const runtime = "nodejs";

import { NextResponse } from "next/server";
import * as ort from "onnxruntime-node";
import fs from "fs";
import path from "path";

let session: ort.InferenceSession | null = null;
let labels: string[] = [];

async function loadModel() {
  if (session) return;

  const modelPath = path.join(process.cwd(), "models", "emotion_yolo.onnx");
  const labelsPath = path.join(process.cwd(), "models", "classes.json");

  session = await ort.InferenceSession.create(modelPath);
  labels = JSON.parse(fs.readFileSync(labelsPath, "utf-8"));
}

export async function GET() {
  await loadModel();

  return NextResponse.json({
    status: "ok",
    modelLoaded: true,
    labels,
  });
}

