import { PayMethod, PayType } from "../utils/pay_methods.ts";
import { match, P } from 'ts-pattern';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { Modal } from "./Modal.tsx";
import { Icon } from "../components/Icon.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import QrCreator from 'qr-creator'
import copy from 'copy-to-clipboard'

type Detail = {
  src: string;
  title: string;
  subtitle: string;
  style: {
    plate: string;
    button: string;
  },
  qr: {
    color: string;
  }
}

const DETAILS_MAP: Record<PayType, Detail> = {
  [PayType.DonationAlerts]: {
    src: '/DA.svg',
    title: 'Donation Alerts',
    subtitle: 'Service of receiving donations online',
    style: {
      plate: 'background-image: linear-gradient(to right, #F57507, #F59C07);',
      button: 'background-image: linear-gradient(to right, #F57507, #F59C07);'
    },
    qr: {
      color: '#F57D07'
    }
  },
  [PayType.TON]: {
    src: '/TON.svg',
    title: 'Toncoin',
    subtitle: 'The native cryptocurrency of TON Blockchain.',
    style: {
      plate: 'background: #1E2337;',
      button: 'background: #0098EA;'
    },
    qr: {
      color: '#0098EA'
    }
  }
}

type CardProps = {
  method: PayMethod
}

const Card = ({ method }: CardProps) => {
  const qrRef = useRef<HTMLDivElement>(null!)
  const [isOpen, setIsOpen] = useState(false);

  const details = DETAILS_MAP[method.type];

  const action = match(method)
    .with({ type: PayType.DonationAlerts }, () => 'link')
    .with({ type: PayType.TON }, () => 'dialog')
    .otherwise(() => 'link')

  const href = useMemo(() => {
    return match(method)
      .with({ type: PayType.DonationAlerts, handle: P.select() }, (handle) => 'https://www.donationalerts.com/r/' + handle)
      .with({ type: PayType.TON, address: P.select() }, (address) => 'ton://transfer/' + address)
      .otherwise(() => '')
  }, [method])

  const cryptoAddress = useMemo(() => {
    return match(method)
      .with({ type: PayType.TON, address: P.select() }, (address) => address)
      .otherwise(() => '')
  }, [method])

  const openModal = () => {
    setIsOpen(true);
  }

  useEffect(() => {
    if (!IS_BROWSER) return;
    if (!qrRef.current) return;

    // @ts-expect-error types are not loaded
    QrCreator.render({
      text: href,
      radius: 0.45,
      ecLevel: 'H',
      fill: details.qr.color,
      background: 'rgb(249 250 251)',
      size: innerWidth * devicePixelRatio / 2
    }, qrRef.current);

  }, [isOpen, qrRef]);

  return (
    <>
      <div class="rounded-3xl bg-slate-50 p-1.5 shadow-md w-full">
        <div
          class="w-full rounded-[1.125rem] rounded-b-none font-bold aspect-video p-5 flex items-center justify-center"
          style={details.style.plate}
        >
          <img alt="" class="w-5/6" src={details.src} />
        </div>

        <div class="pt-1 p-2">
          <h2 class="font-semibold text-xl">{details.title}</h2>
          <p class="text-slate-500">{details.subtitle}</p>

          {action === 'link' && (
            <a
              href={href}
              class="inline-block mt-2 rounded-[0.625rem] px-6 py-2 text-white text-xl"
              style={details.style.button}
            >
              Donate
            </a>
          )}

          {action === 'dialog' && (
            <button
              type="button"
              class="inline-block mt-2 rounded-[0.625rem] px-6 py-2 text-white text-xl"
              style={details.style.button}

              onClick={openModal}
            >
              Donate
            </button>
          )}
        </div>
      </div>

      <Modal isOpen={isOpen} setIsOpen={setIsOpen} trapFocus={true}>
        <div class="w-full h-full bg-white shadow-sm rounded-md flex flex-col p-2">
          <div class="w-full flex flex-wrap justify-end">
            <button
              type="button"
              class="flex items-center justify-center gap-2 mb-3 px-3 py-2 rounded-md cursor-pointer"
              style={details.style.button}

              onClick={() => {
                setIsOpen(false);
              }}
            >
              <Icon class="text-white">
                <Icon.Close />
              </Icon>
            </button>
          </div>
        
          <div class="h-full w-full flex flex-col items-center justify-center gap-8">
            <div
              ref={qrRef}
              data-qr={true}
              class="w-full h-full aspect-square max-w-screen lg:max-w-[20vw] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-4"
            />

            <div class="flex flex-col lg:flex-row flex-wrap gap-2 items-center">
              <div>
                <span class="hidden lg:block">
                  {cryptoAddress}
                </span>

                <span class="block lg:hidden" aria-hidden>
                  {cryptoAddress.slice(0, 10) + '...' + cryptoAddress.slice(cryptoAddress.length - 10)}
                </span>
              </div>

              <div class="flex gap-2">
                <button
                  type="button"
                  class="flex gap-2 items-center justify-around rounded-[0.625rem] px-6 py-2 text-white text-xl"
                  style={details.style.button}

                  onClick={() => {
                    copy(cryptoAddress)
                  }}
                >
                  Copy

                  <Icon class="text-white" width={16} height={16}>
                    <Icon.Copy />
                  </Icon>
                </button>

                {href !== '' && (
                  <a
                    href={href}
                    class="flex gap-2 items-center justify-around rounded-[0.625rem] px-6 py-2 text-white text-xl"
                    style={details.style.button}
                  >
                    Donate

                    <Icon class="text-white" width={16} height={16}>
                      <Icon.Share />
                    </Icon>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Card;