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
import { Loader, Plus } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const createMealSchema = z.object({
  name: z.string(),
  description: z.string(),
  dateTime: z.date(),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora inválida"),
  isOnDiet: z.boolean(),
});

type CreateMealFormSchema = z.infer<typeof createMealSchema>;

interface AddMealsFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess?: () => void;
}
export function AddMealsForm({
  isOpen,
  setIsOpen,
  onSuccess,
}: AddMealsFormProps) {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const queryClient = useQueryClient();

  const form = useForm<CreateMealFormSchema>({
    resolver: zodResolver(createMealSchema),
  });

  const { mutateAsync: createMeal, isPending } = useMutation({
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

  async function handleSubmit(data: CreateMealFormSchema) {
    const [hours, minutes] = data.time.split(":").map(Number);

    const combinedDateTime = new Date(data.dateTime);
    combinedDateTime.setHours(hours, minutes);

    await createMeal({
      ...data,
      dateTime: combinedDateTime,
    });
  }

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
      <SheetTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          className="w-full h-12 md:h-14 text-base md:text-lg"
        >
          <Plus className="mr-2 w-5 h-5 md:w-6 md:h-6" /> Nova refeição
        </Button>
      </SheetTrigger>
      <SheetContent side={isLargeScreen ? "right" : "bottom"}>
        <SheetHeader className="mb-2">
          <h2 className="font-semibold text-lg md:text-xl">
            Adicione uma nova refeição
          </h2>
          <SheetDescription>
            Preencha os campos abaixo para adicionar uma nova refeição
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
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="dateTime"
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
              ) : (
                "Cadastrar refeição"
              )}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
