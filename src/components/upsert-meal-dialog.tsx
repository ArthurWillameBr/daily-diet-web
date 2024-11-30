import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { DatePicker } from "./ui/date-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateMeal } from "@/api/create-meal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { toast } from "sonner";
import { UpdateMeal } from "@/api/update-meal";

interface UpsertMealDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess?: () => void;
  mealId?: string;
  defaultValues?: CreateMealFormSchema;
}
const createMealSchema = z.object({
  name: z.string().min(1, "Nome muito curto").max(50, "Nome muito longo"),
  description: z.string().max(100, "Descrição muito longa").nullable(),
  date: z.date(),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora inválida"),
  isOnDiet: z.boolean(),
});

type CreateMealFormSchema = z.infer<typeof createMealSchema>;

export function UpsertMealDialog({
  isOpen,
  setIsOpen,
  onSuccess,
  mealId,
  defaultValues,
}: UpsertMealDialogProps) {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const queryClient = useQueryClient();

  const form = useForm<CreateMealFormSchema>({
    resolver: zodResolver(createMealSchema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
      date: new Date(),
      time: "12:00",
      isOnDiet: true,
    },
  });

  const { mutateAsync: createMeal, isPending: isCreateMealPending } =
    useMutation({
      mutationFn: CreateMeal,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["meals"],
        });
        queryClient.invalidateQueries({
          queryKey: ["total-meals"],
        });
        queryClient.invalidateQueries({
          queryKey: ["meals-within-diet"],
        });
        queryClient.invalidateQueries({
          queryKey: ["gamification-status"],
        });
        setIsOpen(false);
        if (onSuccess) onSuccess();
      },
    });

  const { mutateAsync: updateMeal, isPending: isUpdateMealPending } =
    useMutation({
      mutationFn: UpdateMeal,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["meals"],
        });
        queryClient.invalidateQueries({
          queryKey: ["total-meals"],
        });
        queryClient.invalidateQueries({
          queryKey: ["meals-within-diet"],
        });
        queryClient.invalidateQueries({
          queryKey: ["gamification-status"],
        });
        setIsOpen(false);
        if (onSuccess) onSuccess();
      },
    });

  async function handleSubmit(data: CreateMealFormSchema) {
    const [hours, minutes] = data.time.split(":").map(Number);

    const combinedDateTime = new Date(data.date);
    combinedDateTime.setHours(hours, minutes);
    try {
      if (mealId) {
        await updateMeal({
          ...data,
          dateTime: combinedDateTime,
          mealId,
        });
        toast.success("Refeição atualizada com sucesso");
        form.reset();
        return;
      } else {
        await createMeal({
          ...data,
          dateTime: combinedDateTime,
        });
        toast.success("Refeição cadastrada com sucesso");
        form.reset();
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao cadastrar refeição");
    }
  }

  const isPending = isCreateMealPending || isUpdateMealPending;

  const isUpdate = !!mealId;

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
        }
      }}
    >
      <SheetTrigger asChild></SheetTrigger>
      <SheetContent side={isLargeScreen ? "right" : "bottom"}>
        <SheetHeader className="mb-2">
          <h2 className="font-semibold text-lg md:text-xl">
            {isUpdate ? "Atualizar refeição" : "Adicionar refeição"}
          </h2>
          <SheetDescription>
            {isUpdate
              ? "Atualize os dados da refeição"
              : "Cadastre uma nova refeição"}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Frango grelhado" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="200g de frango grelhado com legumes"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="w-fit">
                    <FormLabel>Data</FormLabel>
                    <DatePicker value={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="w-fit lg:w-[160px]">
                    <FormLabel>Hora</FormLabel>
                    <FormControl>
                      <Input type="time" placeholder="HH:mm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="isOnDiet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Está dentro da dieta?</FormLabel>
                  <FormControl>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        className={`lg:w-[200px] space-x-2 w-full h-12 md:h-14 flex items-center justify-center rounded-lg
                              ${
                                field.value === true
                                  ? "bg-green-100 border border-green-500"
                                  : "bg-gray-200"
                              }`}
                        onClick={() => field.onChange(true)}
                      >
                        <div className="bg-green-500 rounded-full size-2" />
                        <span
                          className={`text-base font-medium ${
                            field.value === true
                              ? "text-green-500"
                              : "text-gray-700"
                          }`}
                        >
                          Sim
                        </span>
                      </button>
                      <button
                        type="button"
                        className={`lg:w-[200px] space-x-2 w-full h-12 md:h-14 flex items-center justify-center rounded-lg 
                          ${
                            field.value === false
                              ? "bg-red-100 border border-red-500"
                              : "bg-gray-200"
                          }`}
                        onClick={() => field.onChange(false)}
                      >
                        <div className="bg-red-500 rounded-full size-2 " />

                        <span
                          className={`text-base font-medium ${
                            field.value === false
                              ? "text-red-500"
                              : "text-gray-700"
                          }`}
                        >
                          Não
                        </span>
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full h-12" disabled={isPending}>
              {isPending ? (
                <Loader className="animate-spin" />
              ) : isUpdate ? (
                "Atualizar"
              ) : (
                "Cadastrar"
              )}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
