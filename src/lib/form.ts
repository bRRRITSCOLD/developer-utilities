import { FieldApi } from "@tanstack/react-form"
import { ChangeEvent } from "react"

export const handleBlur = (field: FieldApi<any, any, any, any>) => {
  return () => {
    field.handleBlur()
  }
}

export const handleFocus = (field: FieldApi<any, any, any, any>) => {
  return () => {
    field.setMeta({
      ...field.state.meta,
      isBlurred: false,
    })
  }
}

export const handleChange = (field: FieldApi<any, any, any, any>) => {
  return (e: ChangeEvent<HTMLInputElement>) => {
    field.handleChange(e.target.value)
  }
}
