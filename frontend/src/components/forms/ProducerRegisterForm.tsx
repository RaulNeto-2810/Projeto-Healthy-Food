import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

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

export function ProducerRegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        cpfCnpj: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [confirmError, setConfirmError] = useState<string | null>(null);
    const [cpfCnpjError, setCpfCnpjError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });

        if (e.target.id === "confirmPassword") setConfirmError(null);
        if (e.target.id === "password") setError(null);
        if (e.target.id === "cpfCnpj") setCpfCnpjError(null);
    };

    // --- Validação de senha ---
    const validatePassword = (password: string) => {
        const commonPasswords = [
            "123456", "12345678", "123456789", "password", "senha",
            "abc123", "qwerty", "111111", "000000", "123123"
        ];

        if (password.length < 8) {
            return "Senha curta: deve ter pelo menos 8 caracteres.";
        }
        if (commonPasswords.includes(password.toLowerCase())) {
            return "Senha muito simples: escolha uma senha mais segura.";
        }
        if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
            return "A senha deve conter letras e números.";
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setConfirmError(null);
        setCpfCnpjError(null);

        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setConfirmError("As senhas não coincidem.");
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                'http://127.0.0.1:8000/api/auth/registration/',
                {
                    username: formData.email,
                    email: formData.email,
                    password1: formData.password,
                    password2: formData.confirmPassword,
                    cpf_cnpj: formData.cpfCnpj,
                    name: formData.name,
                    phone: formData.phone,
                }
            );

            alert('Cadastro realizado com sucesso! Você será redirecionado para a tela de login.');
            navigate('/login');

        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const errorData = err.response.data;

                if (errorData?.cpf_cnpj) {
                    setCpfCnpjError(errorData.cpf_cnpj[0]);
                } else if (errorData?.email) {
                    setError(errorData.email[0]);
                } else if (errorData?.username) {
                    setError(errorData.username[0]);
                } else if (errorData?.password1) {
                    setError(errorData.password1[0]);
                } else {
                    setError("Ocorreu um erro ao tentar criar a conta. Tente novamente.");
                }
            } else {
                setError("Ocorreu um erro ao tentar criar a conta. Tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="px-8 px-[1.01em] py-[1.01em]">
                    <CardTitle>Cadastro Produtor</CardTitle>
                    <CardDescription>
                        Crie sua conta preenchendo os dados abaixo.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8">
                    <form onSubmit={handleSubmit}>
                        <FieldGroup className="gap-8">

                            {/* Nome */}
                            <Field className="gap-3">
                                <div className="px-[1.01em]">
                                    <FieldLabel htmlFor="name">Nome</FieldLabel>
                                </div>
                                <div className="px-[1.01em]">
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        className="py-[1.01em] px-3"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </Field>

                            {/* CPF/CNPJ */}
                            <Field className="gap-3">
                                <div className="px-[1.01em]">
                                    <FieldLabel htmlFor="cpfCnpj">CPF ou CNPJ</FieldLabel>
                                </div>
                                <div className="px-[1.01em]">
                                    <Input
                                        id="cpfCnpj"
                                        type="text"
                                        required
                                        className="py-[1.01em] px-3"
                                        value={formData.cpfCnpj}
                                        onChange={handleChange}
                                    />
                                </div>
                                {cpfCnpjError && (
                                    <div className="px-[1.01em]">
                                        <p className="text-sm text-red-500 text-center">{cpfCnpjError}</p>
                                    </div>
                                )}
                            </Field>

                            {/* Telefone */}
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
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </Field>

                            {/* Email */}
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
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </Field>

                            {/* Senha */}
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
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                {error && (
                                    <div className="px-[1.01em]">
                                        <p className="text-sm text-red-500 text-center">{error}</p>
                                    </div>
                                )}
                            </Field>

                            {/* Confirmar Senha */}
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
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                                {confirmError && (
                                    <div className="px-[1.01em]">
                                        <p className="text-sm text-red-500 text-center">{confirmError}</p>
                                    </div>
                                )}
                            </Field>

                            {/* Botões */}
                            <Field className="gap-4">
                                <div className="px-[1.01em]">
                                    <Button
                                        type="submit"
                                        className="w-full py-[1.01em]"
                                        disabled={loading}
                                    >
                                        {loading ? 'Criando conta...' : 'Cadastrar'}
                                    </Button>
                                </div>

                                <div className="px-[1.01em] py-[1.01em]">
                                    <FieldDescription className="text-center">
                                        Já tem uma conta?{" "}
                                        <Link to="/login-produtor" className="text-center">
                                            Faça login
                                        </Link>
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
