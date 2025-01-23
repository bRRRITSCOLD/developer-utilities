import { useState } from "react"
import { ExternalToast, toast } from "sonner"
import { v4 as uuid } from "uuid"

export const useToast = () => {
  const [toastIds, setToastIds] = useState<Array<string | number>>([])

  const t = {
    error: (message: string, data: ExternalToast) => {
      let id: string | number
      if (!data.id) {
        id = uuid()
      } else {
        id = data.id
      }

      setToastIds(state => [...state, id])

      if (!toastIds.filter(item => item === id).length) {
        id = toast.error(message, {
          ...data,
          id
        })
      }

      return id
    }
  }

  const dismiss = (id: string | number) => {
    toast.dismiss(id)

    setToastIds(state => state.filter(toastId => toastId !== id))
  }

  return {
    toast: t,
    dismiss,
    dismissAll: () => {
      for (const id of toastIds) {
        dismiss(id)
      }
    }
  }
}