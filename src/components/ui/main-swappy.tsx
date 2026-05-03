'use client'
import { useMemo, useState } from 'react'
import { SlotItemMapArray, utils } from 'swapy'
import { SwapyItem, SwapyLayout, SwapySlot } from '@/components/ui/swappy-draggable-card'
import { SwappyProps } from '@/types/types'

export default function MainSwappy({ items }: { items: SwappyProps[] }) {
  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(
    utils.initSlotItemMap(items, 'id'),
  )

  const slottedItems = useMemo(
    () => utils.toSlottedItems(items, 'id', slotItemMap),
    [items, slotItemMap],
  )

  return (
    <SwapyLayout
      id="swapy"
      className="w-full container  mx-auto "
      config={{
        swapMode: 'hover',
      }}
      onSwap={(event: { newSlotItemMap: { asArray: any } }) => {
        console.log('Swap detected!', event.newSlotItemMap.asArray)
      }}
    >
      <div className="grid w-full  grid-cols-12 gap-2 md:gap-6 ">
        {slottedItems.map(({ slotId, itemId }) => {
          const item = items.find((i) => i.id === itemId)

          return (
            <SwapySlot
              key={slotId}
              className={`swapyItem rounded-lg h-64 ${item?.className}`}
              id={slotId}
            >
              <SwapyItem
                id={itemId}
                className="relative rounded-lg w-full h-full 2xl:text-xl text-sm"
                key={itemId}
              >
                {item?.widgets}
              </SwapyItem>
            </SwapySlot>
          )
        })}
      </div>
    </SwapyLayout>
  )
}
