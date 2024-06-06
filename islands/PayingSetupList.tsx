import type { SortableStartEvent, SortableStopEvent } from 'npm:@shopify/draggable';
import type { PayMethod } from "../utils/pay_methods.ts";
import { useEffect, useState, useRef, useCallback } from "preact/hooks";
import { PayingSetupCard } from "./PayingSetupCard.tsx";
import { loadDraggable } from "../utils/load-draggable.ts";
import { nanoid } from 'nanoid/non-secure'
import { Icon } from '../components/Icon.tsx'
import { PayType } from "../utils/pay_methods.ts";

type Method = {
  id: string;
  method: PayMethod | null;
}

type PayingSetupListProps = {
  Draggable: Awaited<ReturnType<typeof loadDraggable>>

  methods: Method[];
  handle: string;
}

const PayingSetupList = ({ Draggable, handle, methods: serverMethods }: PayingSetupListProps) => {
  const { Plugins, Sortable } = Draggable;

  const ulRef = useRef<HTMLUListElement>(null!)
  const [methods, setMethods] = useState<Method[]>(serverMethods);

  const onSortableStart = useCallback((e: SortableStartEvent) => {
    if (methods.length === 1) {
      return e.cancel()
    }

    const target = e.dragEvent.originalEvent.target;

    if (target && target instanceof SVGElement) {
      e.cancel();
    }
  }, [methods]);

  const onSortableStop = useCallback(({ oldIndex, newIndex }: SortableStopEvent) => {
    const copy = [...methods];

    const old = copy[oldIndex]
    const replacement = copy[newIndex];

    copy[oldIndex] = replacement;
    copy[newIndex] = old;

    setMethods(copy);
  }, [methods]);

  useEffect(() => {
    if (!ulRef.current) {
      return;
    }

    const sortable = new Sortable(ulRef.current, {
      draggable: 'li',
      plugins: [
        Plugins.SortAnimation
      ],
    })

    sortable.on('sortable:start', onSortableStart)
    sortable.on('sortable:stop', onSortableStop)

    return () => {
      sortable.destroy();
    }
  }, [onSortableStart, onSortableStop])

  return (
    <>
      <div class="flex gap-2 mb-3">
        <button
          type="button"
          class="flex items-center justify-center gap-2 bg-gradient-to-r from-[#6365f14e] to-[#0ea4e94e] px-3 py-2 rounded-md cursor-pointer"
          
          onClick={() => {
            setMethods((prev) => {
              return [
                ...prev,
                {
                  id: nanoid(),
                  method: null
                }
              ]
            })
          }}
        >
          Add

          <Icon>
            <Icon.Add />
          </Icon>
        </button>

        <button
          type="button"
          class="flex items-center justify-center gap-2 bg-gradient-to-r from-[#6365f14e] to-[#0ea4e94e] px-3 py-2 rounded-md cursor-pointer"
          
          onClick={() => {
            const mapped = methods.map(method => method.method);

            const filtered = mapped.filter((method) => {
              if (!method) return false;

              if (method.type === PayType.DonationAlerts) {
                return Boolean(method.handle)
              }

              if (method.type === PayType.TON) {
                return Boolean(method.address);
              }

              return false;
            })

            if (filtered.length === 0) {
              return;
            }

            const save = async () => {
              const response = await fetch('/api/set-dashboard', {
                method: 'POST',
                body: JSON.stringify(filtered)
              })

              if (!response.ok) {
                return;
              }

              const json = await response.json() as {
                success: boolean
              }

              if (json.success) {
                setMethods(filtered.map((method) => {
                  return {
                    id: nanoid(),
                    method
                  }
                }))
              }
            }

            void save()
          }}
        >
          Save

          <Icon>
            <Icon.Check />
          </Icon>
        </button>

        <a
          class="flex items-center justify-center gap-2 bg-gradient-to-r from-[#6365f14e] to-[#0ea4e94e] px-3 py-2 rounded-md cursor-pointer"
          target="_blank"
          href={`/@${handle}`}
        >
          View

          <Icon>
            <Icon.Share />
          </Icon>
        </a>
      </div>

      <ul class="flex flex-col gap-3" ref={ulRef}>
        {methods.map(({ method, id }) => (
          <li key={id}>
            <PayingSetupCard
              method={method}

              onChange={(state) => {
                if (state.type === 'NONE') return;

                const updatedMethods = methods.map((m) => {
                  if (m.id === id) {
                    return {
                      method: state,
                      id
                    }
                  }

                  return m;
                });

                setMethods([...updatedMethods])
              }}

              remove={() => {
                setMethods([...methods.filter((method) => method.id !== id)])
              }}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

export { PayingSetupList }