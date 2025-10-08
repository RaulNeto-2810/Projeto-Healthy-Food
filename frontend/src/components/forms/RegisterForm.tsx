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

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="px-8 px-[1.01em] py-[1.01em]">
                    <CardTitle>Cadastro Cliente</CardTitle>
                    <CardDescription>
                        Crie sua conta preenchendo os dados abaixo.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8">
                    <form>
                        <FieldGroup className="gap-8">
                            <Field className="gap-3">
                                <div className="px-[1.01em]">
                                    <FieldLabel htmlFor="name">Nome</FieldLabel>
                                </div>
                                <div className="px-[1.01em]">
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Seu nome completo"
                                        required
                                        className="py-[1.01em] px-3"
                                    />
                                </div>
                            </Field>
                            <Field className="gap-3">
                                <div className="px-[1.01em]">
                                    <FieldLabel htmlFor="phone">Celular ou Telefone</FieldLabel>
                                </div>
                                <div className="px-[1.01em]">
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="(00) 00000-0000"
                                        required
                                        className="py-[1.01em] px-3"
                                    />
                                </div>
                            </Field>
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
                                        className="py-[1.01em] px-3"
                                    />
                                </div>
                            </Field>
                            <Field className="gap-3">
                                <div className="px-[1.01em]">
                                    <FieldLabel htmlFor="password">Senha</FieldLabel>
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
                            <Field className="gap-3">
                                <div className="px-[1.01em]">
                                    <FieldLabel htmlFor="confirmPassword">Confirmar Senha</FieldLabel>
                                </div>
                                <div className="px-[1.01em]">
                                    <Input
                                        id="confirmPassword"
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
                                        Cadastrar
                                    </Button>
                                </div>
                                <div className="px-[1.01em]">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        className="w-full py-[1.01em]"
                                    >
                                        Cadastrar com o Google
                                    </Button>
                                </div>
                                <div className="px-[1.01em] py-[1.01em]">
                                    <FieldDescription className="text-center">
                                        Já tem uma conta?  <a href="/login">Faça login</a>
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
