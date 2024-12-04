// node_modules
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { CircleAlert } from 'lucide-react';
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { AnimatePresence, useAnimate, usePresence, motion } from "motion/react"
import * as crypto from 'crypto'

// components
import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogDescription, DialogTitle, DialogOverlay } from "../ui/dialog";
import { Label } from "../ui/label";
import { SensitiveTextInput } from "../ui/input";
import { Button } from "../ui/button";

// stores
import { useStronghold } from "@/stores/stronghold"

// schemas
import { strongholdPluginInitDialogFormSchema } from "@/schemas/stronghold";

// libs
import { handleBlur, handleChange, handleFocus } from "@/lib/form";

// hooks
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { warn } from '@tauri-apps/plugin-log';
import { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function StrongholdPluginInitDialog() {
  const { queries, mutations } = useStronghold()

  const [toastIds, setToastIds] = useState<number[]>([])

  const { toast, ...toastActions } = useToast()

  useEffect(() => {
    () => {
      toastActions.dismissAll()
      mutations.strongholdPluginInitMutation.reset()
    }
  }, [])

  const form = useForm({
    defaultValues: {
      salt: '',
    },
    onSubmit: async ({ value }) => {
      await Promise.allSettled([
        mutations.strongholdPluginInitMutation.mutateAsync(
          value.salt
        )
      ])
    },
    onSubmitInvalid: ({ value }) => {
      warn(`Invalid StrongholdPluginInitDialog submit: ${JSON.stringify(value)}`)
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: strongholdPluginInitDialogFormSchema,
      onSubmit: strongholdPluginInitDialogFormSchema,
    }
  })

  useEffect(() => {
    if (mutations.strongholdPluginInitMutation.error) {
      const toastId = toast.error((mutations.strongholdPluginInitMutation as any).error, {
        id: 'strongholdPluginInitMutation.error',
        position: 'top-center',
        onAutoClose: () => toastActions.dismiss(toastId),
        onDismiss: () => toastActions.dismiss(toastId),
        duration: 3000,
        richColors: true,
        closeButton: true
      })
    }
  }, [mutations.strongholdPluginInitMutation.error])

  const open = useMemo(() => {
    return queries.strongholdPluginSaltFileExistsQuery.data === false ||
      mutations.strongholdPluginInitMutation.error !== null
  }, [queries.strongholdPluginSaltFileExistsQuery.data, mutations.strongholdPluginInitMutation.error])

  return <div>
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .5 }}
        />
      )}
    </AnimatePresence>
    <Toaster />
    <Dialog
    modal={false}
    open={open}
  >
    <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} hideClose={true} className="sm:max-w-[425px]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <DialogHeader>
          <DialogTitle>Stronghold</DialogTitle>
          <DialogDescription className="">
            Pick a salt random salt for your Stronghold utility initialization.
          </DialogDescription>
        </DialogHeader>

        <div className="grid mt-4">
          <div className="grid grid-cols-12 items-center">
            <form.Field
              name="salt"
              children={(field) => (
                <>
                  <Label htmlFor="salt" className="col-span-2">
                    Salt
                  </Label>

                  <div className="relative col-span-10">
                    <SensitiveTextInput
                      id="salt"
                      name={field.name}
                      value={field.state.value}
                      onBlur={handleBlur(field)}
                      onFocus={handleFocus(field)}
                      onChange={handleChange(field)}
                      className="text-muted-foreground"
                    >
                      <div className="absolute -top-4 -right-4 flex cursor-pointer items-center">
                        {field.state.meta.errorMap.onChange ? (
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>
                                <CircleAlert color=" hsl(358, 100%, 81%)" strokeWidth={3} />
                              </TooltipTrigger>
                              <TooltipContent className="bg-[hsl(357,89%,16%);]">
                                <p className="text-[hsl(358,100%,81%)]">{field.state.meta.errorMap.onChange}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : null}
                      </div>
                    </SensitiveTextInput>
                  </div>
                </>
              )}
            />
          </div>
        </div>
        <DialogFooter className="flex flex-row sm:justify-center mt-4">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}
            children={([canSubmit, isSubmitting, isDirty]) => (
              <Button type="submit" disabled={!canSubmit || !isDirty}>{isSubmitting ? '...' : 'Save'}</Button>
            )}
          />

          <Button type="button" onClick={() => {
            form.setFieldValue('salt', [...Array(35)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''))
          }}>Random</Button>
        </DialogFooter>
      </form>
    </DialogContent>


  </Dialog>
  </div>
}
