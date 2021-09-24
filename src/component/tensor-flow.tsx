import { AnimatePresence, motion } from 'framer-motion';
import Script from 'next/script';
import React, { FC, useRef, useState } from 'react';
import { Button, ButtonVariant } from './button';
import { Input } from './input';
import { CameraPlaceholder, LoadingSpinner } from './svg';

const rateProbability = (probability: number) => {
  if (probability > 0.8) {
    return 'and I am pretty sure';
  } else if (probability > 0.5) {
    return 'and I am kinda sure';
  } else if (probability > 0.2) {
    return 'but I am not so sure';
  }

  return 'but I have really no idea';
};

const getMessage = (
  result: string | null,
  probability: number | null,
  hasEmptyClasses: boolean,
  noExamples: boolean,
  mode: TensorFlowMode
) => {
  const resultMessage = `I think it might be a ${result} ${rateProbability(probability || 0)}.`;
  const waitingMessage = 'Waiting for an image to predict...';

  switch (mode) {
    case TensorFlowMode.Default:
      return !!result ? resultMessage : waitingMessage;
    case TensorFlowMode.Training:
      if (!!result) {
        return resultMessage;
      } else if (hasEmptyClasses) {
        return 'Please specify two classes to enable prediction';
      } else if (noExamples) {
        return 'Please add examples to enable prediction';
      } else {
        return waitingMessage;
      }
  }
};

export enum TensorFlowMode {
  Default = 'Default',
  Training = 'Training',
}

type Props = {
  mode?: TensorFlowMode;
};

export const TensorFlow: FC<Props> = ({ mode = TensorFlowMode.Default }) => {
  const [class1, setClass1] = useState('');
  const [class2, setClass2] = useState('');
  const [showFlash, setShowFlash] = useState(false);
  const [loading, setLoading] = useState(false);
  const [classifier, setClassifier] = useState<any | null>(null);
  const [mobilenet, setMobilenet] = useState<any | null>(null);
  const [webcam, setWebcam] = useState<any | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [probability, setProbability] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isTrainingMode = mode === TensorFlowMode.Training;
  const hasEmptyClasses = isTrainingMode && (!class1 || !class2);

  const captureImage = async () => {
    const img = await webcam.capture();
    const classifiedResult = await mobilenet.classify(img);
    setResult(classifiedResult[0].className);
    setProbability(classifiedResult[0].probability);
    img.dispose();
  };

  const getPrediction = async () => {
    if (classifier.getNumClasses() > 0) {
      const classes = [class1, class2];
      const img = await webcam.capture();
      const activation = mobilenet.infer(img, 'conv_preds');
      const predictionResult = await classifier.predictClass(activation);
      setResult(classes[predictionResult.label]);
      setProbability(predictionResult.confidences[predictionResult.label]);
      img.dispose();
    }

    await (window as any).tf.nextFrame();
  };

  const addExample = async (classId: number) => {
    if (classifier) {
      const img = await webcam.capture();
      const activation = mobilenet.infer(img, true);
      classifier.addExample(activation, classId);
      img.dispose();
    }
  };

  const toggleWebcam = async () => {
    if (webcam) {
      setWebcam(null);
      setResult(null);
      return;
    }

    if (isTrainingMode) {
      const knnClassifier = await (window as any).knnClassifier.create();
      setClassifier(knnClassifier);
    }

    setLoading(true);
    const net = await (window as any).mobilenet.load();
    const tfCamera = await (window as any).tf.data.webcam(videoRef.current, {
      facingMode: 'environment',
    });
    setWebcam(tfCamera);
    setMobilenet(net);
    setLoading(false);
  };

  const toggleFlash = () => {
    setShowFlash(true);
    const timer = setTimeout(() => {
      setShowFlash(false);
    }, 200);
    return () => clearTimeout(timer);
  };

  return (
    <div className="grid grid-flow-row gap-8">
      {/* Load TensorFlow.js */}
      <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs" strategy="beforeInteractive" />
      {/* Load MobileNet */}
      <Script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet" strategy="beforeInteractive" />
      {/* Load K-Nearest Neighbors Classifier */}
      <Script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/knn-classifier" strategy="beforeInteractive" />

      {isTrainingMode && (
        <>
          <div className="grid grid-flow-row gap-4 sm:max-w-[400px]">
            <div className="flex justify-between items-end gap-2">
              <Input onChange={(value) => setClass1(value)} id="class1" label="Class 1" placeholder="e.g. Bottle" />
              <Button
                disabled={!class1 || !webcam}
                className="flex-shrink-0"
                onClick={() => {
                  toggleFlash();
                  addExample(0);
                }}
              >
                Add example
              </Button>
            </div>
            <div className="flex justify-between items-end gap-2">
              <Input onChange={(value) => setClass2(value)} id="class2" label="Class 2" placeholder="e.g. Pencil" />
              <Button
                disabled={!class2 || !webcam}
                className="flex-shrink-0"
                onClick={() => {
                  toggleFlash();
                  addExample(1);
                }}
              >
                Add example
              </Button>
            </div>
          </div>
        </>
      )}

      <div className="relative bg-gray-50 overflow-hidden rounded-lg w-full sm:w-[640px] h-[200px] sm:h-[400px]">
        <video
          autoPlay
          playsInline
          muted
          width="640px"
          height="400px"
          ref={videoRef}
          hidden={!webcam}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-contain"
        />
        {!!webcam ? (
          <div className="absolute top-2 right-2">
            <Button onClick={() => toggleWebcam()}>
              <CameraPlaceholder />
            </Button>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 grid place-content-center text-gray-200">
              <CameraPlaceholder size={160} />
            </div>
            <div className="absolute inset-0 grid place-content-center">
              <Button onClick={() => toggleWebcam()}>
                {loading ? (
                  <div className="animate-spin text-white h-4 w-4">
                    <LoadingSpinner />
                  </div>
                ) : (
                  'Activate camera'
                )}
              </Button>
            </div>
          </>
        )}

        <AnimatePresence>
          {showFlash && (
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1, ease: 'easeInOut' }}
            />
          )}
        </AnimatePresence>
      </div>

      <Button
        disabled={!webcam || hasEmptyClasses || (isTrainingMode && classifier.getNumClasses() === 0)}
        variant={ButtonVariant.Large}
        onClick={() => {
          isTrainingMode ? getPrediction() : captureImage();
          toggleFlash();
        }}
      >
        Predict image
      </Button>

      <p>
        {getMessage(
          result,
          probability,
          hasEmptyClasses,
          !webcam || classifier === null || classifier.getNumClasses() === 0,
          mode
        )}
      </p>
    </div>
  );
};
