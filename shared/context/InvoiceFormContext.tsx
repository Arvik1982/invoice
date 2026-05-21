import React, { createContext, useContext, useMemo } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { emptyInvoice } from "@/shared/constants/invoices";
import { Invoice } from "@/types/main";

interface InvoiceFormContextType {
  form: UseFormReturn<Invoice>;
}

const InvoiceFormContext = createContext<InvoiceFormContextType | undefined>(
  undefined,
);

export const InvoiceFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const form = useForm<Invoice>({
    defaultValues: emptyInvoice,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const value = useMemo(() => ({ form }), [form]);

  return (
    <InvoiceFormContext.Provider value={value}>
      {children}
    </InvoiceFormContext.Provider>
  );
};

export const useInvoiceForm = () => {
  const context = useContext(InvoiceFormContext);

  if (!context) {
    throw new Error("useInvoiceForm must be used within InvoiceFormProvider");
  }
  const { form } = context;
  const {
    control,
    setValue,
    watch,
    getValues,
    formState,
    reset,
    handleSubmit,

    ...rest
  } = form;

  return { form, watch, control, setValue, getValues, reset, ...rest };
};
