import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="px-8 px-[1.01em] py-[1.01em]">
                    <CardTitle>Login Cliente</CardTitle>
                    <CardDescription>
                        Digite seu e-mail abaixo para acessar sua conta.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8">
                    <form>
                        <FieldGroup className="gap-8">
                            <Field className="gap-3">
                                <div className="px-[1.01em]">
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                </div>
                                <div className="px-[1.01em]">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="seuemail@example.com"
                                        required
                                        className="py-[1.01em] px-4"
                                    />
                                </div>
                            </Field>
                            <Field className="gap-3">
                                <div className="flex items-center px-[1.01em]">
                                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Esqueceu sua senha?
                                    </a>
                                </div>
                                <div className="px-[1.01em]">
                                    <Input 
                                        id="password" 
                                        type="password" 
                                        required 
                                        className="py-[1.01em] px-3"
                                    />
                                </div>
                            </Field>
                            <Field className="gap-4">
                                <div className="px-[1.01em]">
                                    <Button 
                                        type="submit" 
                                        className="w-full py-[1.01em]"
                                    >
                                        Login
                                    </Button>
                                </div>
                                <div className="px-[1.01em]">
                                    <Button 
                                        variant="outline" 
                                        type="button"
                                        className="w-full py-[1.01em]"
                                    >
                                        Fazer Login com o Google
                                    </Button>
                                </div>
                                <div className="px-[1.01em] py-[1.01em]">
                                    <FieldDescription className="text-center">
                                        Não tem uma conta?  <a href="/register">Cadastre-se</a>
                                    </FieldDescription>
                                </div>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
