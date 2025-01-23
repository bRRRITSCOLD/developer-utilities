// // node_modules
// import { FieldApi, ReactFormExtendedApi, useForm } from '@tanstack/react-form'
// import { zodValidator } from '@tanstack/zod-form-adapter'

// // components
// import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";

// // stores
// import { useStrongholdPlugin } from "@/stores/stronghold/plugin"

// // SCHEMAS
// import { strongholdPluginInitDialogFormSchema } from "@/schemas/stronghold";

// // LIBS
// import { handleBlur, handleChange, handleFocus } from "@/lib/form";
// import { useState } from 'react';
// import { CircleAlert, Eye, EyeOff } from 'lucide-react';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

// export function StrongholdPluginInitDialog() {
//   const { state, mutations } = useStrongholdPlugin()

//   const form = useForm({
//     defaultValues: {
//       salt: '',
//     },
//     onSubmit: async ({ value }) => {
//       await Promise.allSettled([
//         mutations.pluginInitMutation.mutateAsync(
//           value.salt
//         )
//       ])
//     },
//     validatorAdapter: zodValidator(),
//     validators: {
//       onChange: strongholdPluginInitDialogFormSchema,
//       onSubmit: strongholdPluginInitDialogFormSchema,
//     }
//   })

//   const [showPassword, setShowPassword] = useState(false);
//   const togglePasswordVisibility = () => setShowPassword(!showPassword);

//   return <Dialog
//     open={state.plugin?.connections.pluginStronghold === undefined}
//   >
//     <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} hideClose={true} className="sm:max-w-[425px]">
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           e.stopPropagation();
//           console.log('form onChange', form)
//           form.handleSubmit();
//         }}
//       >
//         <DialogHeader>
//           <DialogTitle>Stronghold</DialogTitle>
//           <DialogDescription>
//             Used to secure a stronghold vault.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-1">
//           <div className="grid grid-cols-4 items-center gap-4">
//             <form.Field
//               name="salt"
//               children={(field) => (
//                 <>
//                   <Label htmlFor="salt" className="">
//                     Password
//                   </Label>

//                   <div className="relative col-span-3">
//                     <div className="absolute -top-4 -right-4 flex cursor-pointer items-center">
//                       {field.state.meta.errorMap.onChange ? (
//                         <TooltipProvider>
//                           <Tooltip delayDuration={0}>
//                             <TooltipTrigger asChild>
//                               <CircleAlert color="#fa0000" strokeWidth={3} />
//                             </TooltipTrigger>
//                             <TooltipContent className="bg-red-600">
//                               <p className="text-white">{field.state.meta.errorMap.onChange}</p>
//                             </TooltipContent>
//                           </Tooltip>
//                         </TooltipProvider>
//                       ) : null}
//                     </div>

//                     <Input
//                       id="salt"
//                       name={field.name}
//                       value={field.state.value}
//                       onBlur={handleBlur(field)}
//                       onFocus={handleFocus(field)}
//                       onChange={handleChange(field)}
//                       className="col-span-3 text-ellipsis overflow-hidden text-nowrap text-gray-300"
//                       type={showPassword ? "text" : "password"}
//                     />
//                     <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400">
//                       {showPassword ? (
//                         <Eye
//                           className="h-4 w-4 text-white"
//                           onClick={togglePasswordVisibility}
//                         />
//                       ) : (
//                         <EyeOff
//                           className="h-4 w-4 text-white"
//                           onClick={togglePasswordVisibility}
//                         />
//                       )}
//                     </div>
//                     {/* TODO: move to tooltip and inset into somewhere */}
//                     {/* {field.state.meta.errorMap.onChange ? (
//                       <p className="col-span-4" role="alert">{field.state.meta.errorMap.onChange}</p>
//                     ) : null} */}
//                   </div>
//                 </>
//               )}
//             />
//           </div>
//         </div>
//         <DialogFooter className="flex flex-row sm:justify-center">
//           <form.Subscribe
//             selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}
//             children={([canSubmit, isSubmitting, isDirty]) => (
//               <Button type="submit" disabled={!canSubmit || !isDirty}>{isSubmitting ? '...' : 'Save'}</Button>
//             )}
//           />
//           {
//             mutations.initStrongholdMutation.error
//               ? <>{mutations.initStrongholdMutation.error.message}</>
//               : null
//           }
//         </DialogFooter>
//       </form>
//     </DialogContent>


//   </Dialog>
// }