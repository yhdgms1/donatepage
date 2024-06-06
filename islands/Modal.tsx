import type { ComponentChildren } from 'preact'

import { useCallback, useEffect, useRef } from "preact/hooks";
import { useClickOutside } from "../utils/hooks/clickOutside.ts";
import { createPortal } from 'preact/compat'

interface ModalProps {
	isOpen: boolean;
	setIsOpen?: (value: boolean) => void;

	onClose?: () => void;

	trapFocus: boolean;

  children: ComponentChildren;
}

const Modal = ({ isOpen, setIsOpen, onClose, trapFocus, children }: ModalProps) => {
  const modalWindowRef = useRef<HTMLDivElement>(null!)

	const handleKeydown = useCallback((event: KeyboardEvent) => {
		if (isOpen && event.key === 'Tab') {
			if (!trapFocus) {
				/**
				 * When multiple Modals are opened we can prevent one from breaking another
				 */
				return;
			}

			if (!modalWindowRef.current) {
				/**
				 * In case modalWindow in undefined
				 */
				return;
			}

			const nodes = modalWindowRef.current.querySelectorAll('*');
			const tabbable = Array.from(nodes).filter((node) => (node as HTMLElement).tabIndex >= 0);

			let index = tabbable.indexOf(document.activeElement!);
			if (index === -1 && event.shiftKey) index = 0;

			index += tabbable.length + (event.shiftKey ? -1 : 1);
			index %= tabbable.length;

			(tabbable[index] as HTMLElement).focus();
			event.preventDefault();
		}
	}, [isOpen, trapFocus]);


	const close = () => {
		setIsOpen && setIsOpen(false);
		onClose && onClose();
	};

  useEffect(() => {
    if (isOpen && onClose) {
      onClose();
    }
  }, [isOpen]);

  useEffect(() => {
    addEventListener('keydown', handleKeydown);

    return () => {
      removeEventListener('keydown', handleKeydown)
    }
  }, [handleKeydown])

  useClickOutside(modalWindowRef.current, close);

  if (!isOpen) return null;

  const modal = (
    <div
      role="dialog"
      class="fixed inset-0 z-[25] bg-[#00000088]"
      aria-modal={true}
      ref={modalWindowRef}
    >
      <div class="min-h-screen flex items-center justify-center">
        <span class="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>
        <div class="text-left z-[24] min-h-[40vh] min-w-[30vw] max-w-[100vw] px-1 flex flex-col items-stretch w-[calc(100vw_-_0.5rem)] lg:w-auto">
          {children}
        </div>
      </div>
    </div>
  );

	return createPortal(modal, document.body);
};

export { Modal };
