import React, { useEffect, useState } from "react";
import { Modal, ModalContent } from "@heroui/modal";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";

type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  isLoading: boolean;
  isSuccess: boolean;
  fadeOutOpts: {
    autoFadeOut?: boolean;
    fadeoutTime?: number;
  };
};

export default function SuccessForm({
  isOpen,
  onClose,
  title,
  message,
  isSuccess,
  isLoading,
  fadeOutOpts: { autoFadeOut = false, fadeoutTime = 3000 },
}: SuccessModalProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isOpen && autoFadeOut) {
      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const newProgress = Math.max(
          0,
          100 - (elapsedTime / fadeoutTime) * 100,
        );

        setProgress(newProgress);

        if (newProgress === 0) {
          clearInterval(timer);
          onClose();
        }
      }, 50);

      return () => clearInterval(timer);
    }
  }, [isOpen, onClose, autoFadeOut, fadeoutTime]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          classNames={{
            base: "bg-background",
            header: "border-b-[1px] border-default-200",
            footer: "border-t-[1px] border-default-200",
            closeButton: "hover:bg-white/5 active:bg-white/10",
          }}
          isOpen={isOpen && !isLoading}
          size="sm"
          onClose={onClose}
        >
          <ModalContent>
            {() => (
              <div className="flex flex-col items-center justify-center p-6">
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center w-full"
                  exit={{ opacity: 0, scale: 0.8 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <motion.div
                      animate={{ scale: 1 }}
                      initial={{ scale: 0 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                      }}
                    >
                      {isSuccess ? (
                        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                      ) : (
                        <XCircle className="w-16 h-16 text-red-500 mb-4" />
                      )}
                    </motion.div>
                  </div>
                  <motion.h2
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-foreground mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {title}
                  </motion.h2>
                  <motion.p
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-foreground-500 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {message}
                  </motion.p>
                  <div>
                    <motion.div
                      animate={{ opacity: 1 }}
                      className="w-full"
                      initial={{ opacity: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <Button
                        className="w-full mb-4"
                        color="primary"
                        variant="shadow"
                        onPress={onClose}
                      >
                        Close
                      </Button>
                      {autoFadeOut && (
                        <Progress
                          aria-label="Auto-close progress"
                          className="max-w-md"
                          color="success"
                          size="sm"
                          value={progress}
                        />
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            )}
          </ModalContent>
        </Modal>
      )}
    </AnimatePresence>
  );
}
