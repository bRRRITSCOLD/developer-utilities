// node_modules
import { FieldApi, ReactFormExtendedApi, useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'

// components
import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input, SensitiveTextInput } from "../ui/input";
import { Button } from "../ui/button";

// stores
import { useStronghold } from "@/stores/stronghold"

// SCHEMAS
import { strongholdPluginInitDialogFormSchema } from "@/schemas/stronghold";

// LIBS
import { handleBlur, handleChange, handleFocus } from "@/lib/form";
import { useState } from 'react';
import { CircleAlert, Eye, EyeOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export function StrongholdPluginInitDialog() {
  const { state, queries, mutations } = useStronghold()

  const form = useForm({
    defaultValues: {
      salt: '',
    },
    onSubmit: async ({ value }) => {
      await mutations.strongholdPluginInitMutation.mutateAsync(
        value.salt
      )
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: strongholdPluginInitDialogFormSchema,
      onSubmit: strongholdPluginInitDialogFormSchema,
    }
  })

  return <Dialog
    open={queries.strongholdPluginSaltFileExistsQuery.data === false}
  >
    <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} hideClose={true} className="sm:max-w-[425px]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('form onChange', form)
          form.handleSubmit();
        }}
      >
        <DialogHeader>
          <DialogTitle>Stronghold</DialogTitle>
          <DialogDescription>
            Pick a salt {JSON.stringify(queries.strongholdPluginSaltFilePathQuery.data)}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-1">
          <div className="grid grid-cols-4 items-center gap-4">
            <form.Field
              name="salt"
              children={(field) => (
                <>
                  <Label htmlFor="salt" className="">
                    Salt
                  </Label>

                  <div className="relative col-span-3">
                    <SensitiveTextInput
                      id="salt"
                      name={field.name}
                      value={field.state.value}
                      onBlur={handleBlur(field)}
                      onFocus={handleFocus(field)}
                      onChange={handleChange(field)}
                      className="text-muted-foreground"
                    >
                      <div className="absolute -top-4 -right-4 flex cursor-pointer items-center text-red-400">
                        {field.state.meta.errorMap.onChange ? (
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>
                                <CircleAlert color="#fa0000" strokeWidth={3} />
                              </TooltipTrigger>
                              <TooltipContent className="bg-red-600">
                                <p className="text-white">{field.state.meta.errorMap.onChange}</p>
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
        <DialogFooter className="flex flex-row sm:justify-center">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}
            children={([canSubmit, isSubmitting, isDirty]) => (
              <Button type="submit" disabled={!canSubmit || !isDirty}>{isSubmitting ? '...' : 'Save'}</Button>
            )}
          />
          {
            mutations.strongholdPluginInitMutation.error
              ? <>{mutations.strongholdPluginInitMutation.error.message}</>
              : null
          }
        </DialogFooter>
      </form>
    </DialogContent>


  </Dialog>
}