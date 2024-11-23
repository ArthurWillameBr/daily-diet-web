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
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type SignInFormSchema = z.infer<typeof signInSchema>;

export function SignIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { signIn, isPending, isAuthenticated } = useAuth();

  const form = useForm<SignInFormSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: searchParams.get("email") || "",
    },
  });

  async function handleSubmit({ email, password }: SignInFormSchema) {
    try {
      await signIn({ email, password });
      toast.success("Login efetuado com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao fazer login");
    }
  }

  if (isAuthenticated) {
    navigate("/home");
  }

  return (
    <Card className="mx-auto max-w-sm shadow-lg p-3">
      <CardHeader className="text-2xl space-y-3">
        Faça Login
        <CardDescription>
          {" "}
          Insira seu e-mail abaixo para entrar na sua conta.
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
              {isPending ? <Loader className="animate-spin" /> : "Entrar"}
            </Button>
          </form>
          <div className="text-center text-sm pt-2">
            Não tem uma conta?{" "}
            <Link to="/auth/sign-up" className="underline">
              Cadastre-se
            </Link>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
