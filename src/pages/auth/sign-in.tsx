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
import { AuthContext } from "@/contexts/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type SignInFormSchema = z.infer<typeof signInSchema>;

export function SignIn() {
  const { signIn } = useContext(AuthContext);

  const form = useForm<SignInFormSchema>({
    resolver: zodResolver(signInSchema),
  });

  async function handleSubmit({ email, password }: SignInFormSchema) {
    await signIn({ email, password });
  }

  return (
    <Card className="mx-auto max-w-sm shadow-lg">
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
            <Button className="w-full">Entrar</Button>
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
