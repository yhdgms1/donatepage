import { useEffect, useState } from "preact/hooks";
import { PayingSetupList } from "./PayingSetupList.tsx";
import { loadDraggable } from "../utils/load-draggable.ts";
import { PayMethod } from "../utils/pay_methods.ts";
import { nanoid } from 'nanoid/non-secure'

type PayingSetupProps = {
  handle: string;
  methods: PayMethod[]
}

const PayingSetup = ({ handle, methods }: PayingSetupProps) => {
  const [draggable, setDraggable] = useState<Awaited<ReturnType<typeof loadDraggable>> | null>(null)

  useEffect(() => {
    /**
     * Why?
     * 
     * Because when I import that module directly build fails
     */
    loadDraggable().then(setDraggable).catch(console.error);
  }, [])

  const payMethods = methods.map((method) => {
    return {
      /**
       * ID created here used only to identify which card is which and not saved anywhere
       * 
       * We can't rely on indexes because they are changed
       * We also can't rely on type and other information because idential methods can be created
       */
      id: nanoid(),
      method
    }
  })

  return (
    <div class="mt-2">
      {draggable && <PayingSetupList Draggable={draggable} handle={handle} methods={payMethods} />}
    </div>
  )
}

export { loadDraggable }
export default PayingSetup;