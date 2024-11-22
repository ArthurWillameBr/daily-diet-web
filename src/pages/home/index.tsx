import { CreateMeal } from "@/api/create-meal";
import { GetMeal } from "@/api/get-meal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, Loader, Plus, Settings, Utensils } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createMealSchema = z.object({
  name: z.string(),
  description: z.string(),
  dateTime: z.date(),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora inválida"),
  isOnDiet: z.boolean(),
});

type CreateMealFormSchema = z.infer<typeof createMealSchema>;

export function Home() {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: meals } = useQuery({
    queryKey: ["meals"],
    queryFn: GetMeal,
  });

  const { mutateAsync: createMeal, isPending } = useMutation({
    mutationFn: CreateMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      setIsOpen(false);
    },
  });

  const form = useForm<CreateMealFormSchema>({
    resolver: zodResolver(createMealSchema),
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
    <main className="flex flex-col h-screen max-w-6xl mx-auto px-5">
      <div className="flex items-center justify-between p-5 md:p-8">
        <div className="flex items-center gap-2">
          <Utensils className="w-6 h-6 md:w-8 md:h-8" />
          <div className="flex flex-col leading-3">
            <p className="text-base md:text-lg">Daily</p>
            <p className="text-base md:text-lg font-semibold">Diet</p>
          </div>
        </div>
        <div>
          <Settings className="w-6 h-6 md:w-8 md:h-8" />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center p-4 md:p-8">
        <Card className="w-full max-w-[450px] md:max-w-[600px] relative rounded-lg">
          <CardContent className="bg-[#E5F0DB] text-center">
            <div className="relative">
              <ArrowUpRight className="absolute top-2 right-2 text-lime-500 w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div className="p-5 md:p-8">
              <h2 className="text-2xl md:text-4xl font-semibold">98.3%</h2>
              <p className="md:text-lg">das refeições dentro da dieta</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-4 md:px-8 py-2 md:py-4 space-y-3">
        <h2 className="font-semibold text-lg md:text-xl">Refeições</h2>
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
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
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
      </div>

      <ScrollArea className="flex-1 px-4 md:px-8">
        <div className="space-y-6 pb-6 md:pb-8">
          {meals?.map((meal, index) => (
            <div key={index} className="space-y-4">
              <h2 className="font-medium text-base md:text-lg pt-4">
                {meal.date}
              </h2>
              {meal.meals.map((meal, index) => (
                <Card key={index} className="shadow-md">
                  <CardContent className="flex items-center p-4 md:p-5">
                    <span className="text-sm md:text-base">{meal.time}</span>
                    <div className="w-[1px] h-4 mx-4 bg-slate-500" />
                    <span className="flex-1 text-sm md:text-base">
                      {meal.name}
                    </span>
                    <div
                      className={`${
                        meal.isOnDiet ? "bg-[#E5F0DB]" : "bg-[#FDE8E8]"
                      } rounded-full size-4 md:size-5`}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </main>
  );
}
