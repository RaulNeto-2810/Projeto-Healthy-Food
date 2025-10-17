// frontend/src/components/forms/ProducerLoginForm.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function ProducerLoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        cpf_cnpj: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Envia dados para API Django
            const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
                cpf_cnpj: formData.cpf_cnpj,
                email: formData.email,
                password: formData.password,
            });

            console.log("Resposta da API de login:", response.data);

            // dj-rest-auth pode retornar diferentes formatos:
            // - JWT: { access, refresh } ou { access_token, refresh_token }
            // - Token: { key }
            const accessToken = response.data.access_token ||
                              response.data.access ||
                              response.data.key;
            const refreshToken = response.data.refresh_token || response.data.refresh;

            if (!accessToken) {
                throw new Error("Token de acesso não recebido da API");
            }

            // Salva o token (pode ser JWT ou Token simples)
            localStorage.setItem("authToken", accessToken);
            if (refreshToken) {
                localStorage.setItem("refreshToken", refreshToken);
            }

            // Define header padrão
            axios.defaults.headers.common["Authorization"] = `Token ${accessToken}`;

            console.log("Tokens salvos no localStorage:", {
                authToken: localStorage.getItem("authToken"),
                refreshToken: localStorage.getItem("refreshToken"),
                authHeader: axios.defaults.headers.common["Authorization"]
            });

            // Redireciona para dashboard do produtor
            navigate("/dashboard-produtor");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.error("Erro no login:", err.response?.data);
                if (err.response?.data?.cpf_cnpj) {
                    setError(err.response.data.cpf_cnpj[0]);
                } else {
                    setError("CPF/CNPJ, e-mail ou senha inválidos. Tente novamente.");
                }
            } else {
                setError("Ocorreu um erro inesperado. Tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="px-8 px-[1.01em] py-[1.01em]">
                    <CardTitle>Login Produtor</CardTitle>
                    <CardDescription>
                        Digite seu e-mail abaixo para acessar sua conta.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8">
                    <form onSubmit={handleSubmit}>
                        <FieldGroup className="gap-8">
                            <Field className="gap-3">
                                <div className="px-[1.01em]">
                                    <FieldLabel htmlFor="cpf_cnpj">CPF ou CNPJ</FieldLabel>
                                </div>
                                <div className="px-[1.01em]">
                                    <Input
                                        id="cpf_cnpj"
                                        type="text"
                                        required
                                        value={formData.cpf_cnpj}
                                        onChange={handleChange}
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
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="py-[1.01em] px-3"
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
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="py-[1.01em] px-3"
                                    />
                                </div>
                            </Field>

                            {error && (
                                <p className="text-red-500 text-sm text-center">{error}</p>
                            )}

                            <Field className="gap-4">
                                <div className="px-[1.01em]">
                                    <Button
                                        type="submit"
                                        className="w-full py-[1.01em]"
                                        disabled={loading}
                                    >
                                        {loading ? "Entrando..." : "Login"}
                                    </Button>
                                </div>
                                <div className="px-[1.01em] py-[1.01em]">
                                    <FieldDescription className="text-center">
                                        Não tem uma conta? <a href="/register-produtor">Cadastre-se</a>
                                    </FieldDescription>
                                </div>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
