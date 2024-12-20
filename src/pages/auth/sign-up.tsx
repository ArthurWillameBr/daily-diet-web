import { Register } from "@/api/register";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { toast } from "sonner";

const signUpSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type SignUpFormSchema = z.infer<typeof signUpSchema>;

export function SignUp() {
  const navigate = useNavigate();

  const form = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const { mutateAsync: signUp, isPending } = useMutation({
    mutationFn: Register,
    onSuccess: (_, variables) => {
      const { email } = variables;
      toast.success(`Bem-vindo ${variables.name}!`, {
        action: {
          label: "Fazer login",
          onClick: () => navigate(`/auth/sign-in?email=${email}`),
        },
      });
    },
  });

  async function handleSubmit({ name, email, password }: SignUpFormSchema) {
    try {
      await signUp({ name, email, password });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card className="mx-auto max-w-sm shadow-lg p-3">
      <CardHeader className="text-2xl space-y-3">
        Cadastre-se
        <CardDescription>
          {" "}
          Faça seu cadastro de maneira rápida e fácil
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                    <Input placeholder="John doe" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jhon@gmail.com"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="*******" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" disabled={isPending}>
              {isPending ? <Loader className="animate-spin" /> : "Cadastrar"}
            </Button>
          </form>
          <div className="text-center text-sm pt-2">
            Já tem uma conta?{" "}
            <Link to="/auth/sign-in" className="underline">
              fazer login
            </Link>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
