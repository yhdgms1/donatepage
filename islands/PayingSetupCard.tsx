import { useEffect, useState, useReducer } from "preact/hooks";
import { Icon } from '../components/Icon.tsx'
import { Modal } from './Modal.tsx'
import { PayType, PayMethod } from "../utils/pay_methods.ts";
import { match, P } from 'ts-pattern';

type State = PayMethod | {
  type: 'NONE'
}

type Action = 
  {
    type: 'set_type',
    to: PayType
  }
|
  {
    type: 'update',
    update: string;
  }

const reducer = (state: State, action: Action): State => {
  if (action.type === 'set_type') {
    if (action.to === PayType.DonationAlerts) {
      return {
        type: PayType.DonationAlerts,
        handle: ''
      }
    } else if (action.to === PayType.TON) {
      return {
        type: PayType.TON,
        address: ''
      }
    }
  }

  if (action.type === 'update') {
    if (state.type === PayType.DonationAlerts) {
      return {
        ...state,
        handle: action.update.replace('https://www.donationalerts.com/r/', '').replace('https://www.donationalerts.com/c/', '')
      }
    } else if (state.type === PayType.TON) {
      return {
        ...state,
        address: action.update.replace('ton://transfer/', '')
      }
    }
  }

  throw new Error('No matching action');
}

type PayingSetupCardProps = {
  method: PayMethod | null;

  onChange: (state: State) => void;
  remove: () => void;
}

const PayingSetupCard = ({ onChange, remove, method }: PayingSetupCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [state, dispatch] = useReducer<State, Action>(reducer, method ? method : {
    type: 'NONE'
  })

  const type = match(state)
    .with({ type: PayType.DonationAlerts }, () => 'Donation Alerts')
    .with({ type: PayType.TON }, () => 'TON')
    .with({ type: 'NONE' }, () => '')
    .otherwise(() => '')

  const inputValue = match(state)
    .with({ type: PayType.DonationAlerts, handle: P.select() }, (handle) => handle)
    .with({ type: PayType.TON, address: P.select() }, (address) => address)
    .with({ type: 'NONE' }, () => '')
    .otherwise(() => '')

  const inputPlaceholder = match(state)
    .with({ type: PayType.DonationAlerts }, () => 'https://www.donationalerts.com/r/')
    .with({ type: PayType.TON }, () => 'UQDs2-O6AYO--6vE3BFAtX3DmHvXm8lMvET7hWHdRPrEH9we')
    .with({ type: 'NONE' }, () => '')
    .otherwise(() => '')

  const label = match(state)
    .with({ type: PayType.DonationAlerts }, () => 'Link to donation page')
    .with({ type: PayType.TON }, () => 'Address of crypto wallet')
    .with({ type: 'NONE' }, () => '')
    .otherwise(() => '')

  const description = (() => {
    if (inputValue.length >= 18) {
      return inputValue.slice(0, 4) + '...' + inputValue.slice(inputValue.length - 4)
    }

    return inputValue;
  })();
  
  useEffect(() => {
    onChange(state);
  }, [inputValue])

  return (
    <button
      class="min-w-full lg:min-w-[50%] max-w-[100vw] gap-2 flex items-center justify-between relative bg-gradient-to-r from-[#6365f14e] to-[#0ea4e94e] px-6 py-4 shadow-sm ring-1 ring-gray-900/5 rounded-lg cursor-pointer"

      onClick={() => {
        setIsOpen(true);
      }}
    >
      <div class="flex flex-col items-start">
        <span class="font-semibold text-lg">{type || <>Unspecified</>}</span>
        <span class="text-gray-600">
          {description || <>Unspecified</>}
        </span>
      </div>

      <Icon class="text-gray-600">
        <Icon.Pencil />
      </Icon>

      <Modal isOpen={isOpen} setIsOpen={setIsOpen} trapFocus={true}>
        <div class="w-full h-full bg-white shadow-sm rounded-md flex flex-col p-2">
          <div class="w-full flex flex-wrap justify-between">
            <p class="font-semibold">
              Edit
            </p>

            <button
              type="button"
              class="flex items-center justify-center gap-2 mb-3 bg-gradient-to-r from-[#6365f14e] to-[#0ea4e94e] px-3 py-2 rounded-md cursor-pointer"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <Icon>
                <Icon.Close />
              </Icon>
            </button>
          </div>
        
          <div class="h-full w-full">
            <label class="block mb-2">
              <span class="block mb-2 text-sm font-medium text-gray-900">Select platform</span>

              <select 
                required 
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 max-w-64"
                onChange={(event) => {
                  dispatch({
                    type: 'set_type',
                    to: Number(event.currentTarget.value)
                  });
                }}
              >
                {state.type === 'NONE' && (<option selected disabled hidden value="">Select</option>)}

                <option
                  value={String(PayType.DonationAlerts)}
                  selected={state.type === PayType.DonationAlerts}
                >
                  DonationAlerts
                </option>

                <option
                  value={String(PayType.TON)}
                  selected={state.type === PayType.TON}
                >
                  TON
                </option>
              </select>
            </label>

            {state.type !== 'NONE' && (
              <label class="block mb-2">
                <span class="block mb-2 text-sm font-medium text-gray-900">
                  {label}
                </span>

                <input
                  type="text"

                  required={true}

                  spellcheck={false}
                  autocomplete="off"

                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 max-w-64"

                  placeholder={inputPlaceholder}

                  value={inputValue}
                  onInput={(event) => {
                    dispatch({ type: 'update', update: event.currentTarget.value.trim() })
                  }}
                />
              </label>
            )}

            <button
              type="button"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 max-w-64"

              onClick={remove}
            >
              Remove
            </button>
          </div>
        </div>
      </Modal>
    </button>
  )
}

export { PayingSetupCard }