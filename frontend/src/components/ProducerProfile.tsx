import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import axios from "axios";

interface ProducerData {
    id?: number;
    name: string;
    phone: string;
    city: string;
    email: string;
    cpf_cnpj: string;
    address?: string;
}

const API_URL = 'http://127.0.0.1:8000/api/my-profile/';

export function ProducerProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [producerData, setProducerData] = useState<ProducerData | null>(null);
    const [formData, setFormData] = useState<ProducerData | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Buscar dados do perfil ao carregar o componente
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setFetchLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Token de autenticação não encontrado');
            }

            const response = await axios.get(API_URL, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            setProducerData(response.data);
            setFormData(response.data);
        } catch (err: any) {
            console.error('Erro ao buscar perfil:', err);
            if (err.response?.status === 401) {
                setError('Sessão expirada. Faça login novamente.');
            } else if (err.response?.status === 404) {
                setError('Perfil não encontrado.');
            } else {
                setError('Erro ao carregar perfil. Tente novamente.');
            }
        } finally {
            setFetchLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setFormData(producerData);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData(producerData);
        setError(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (formData) {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSave = async () => {
        if (!formData) return;

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Token de autenticação não encontrado');
            }

            // Envia apenas os campos editáveis
            const updateData = {
                name: formData.name,
                phone: formData.phone,
                city: formData.city,
                address: formData.address
            };

            const response = await axios.patch(API_URL, updateData, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setProducerData(response.data);
            setFormData(response.data);
            setIsEditing(false);
            alert('Perfil atualizado com sucesso!');
        } catch (err: any) {
            console.error('Erro ao atualizar perfil:', err);
            if (err.response?.status === 401) {
                setError('Sessão expirada. Faça login novamente.');
            } else if (err.response?.data) {
                // Mostra erros de validação do backend
                const errorMessages = Object.values(err.response.data).flat().join(' ');
                setError(errorMessages || 'Erro ao atualizar perfil. Verifique os dados.');
            } else {
                setError('Erro ao atualizar perfil. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Carregando perfil...</p>
                </div>
            </div>
        );
    }

    if (error && !producerData) {
        return (
            <div className="w-full h-full flex items-center justify-center p-6">
                <Card className="max-w-md">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <p className="text-destructive">{error}</p>
                            <Button onClick={fetchProfile} variant="outline">
                                Tentar Novamente
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!producerData || !formData) {
        return null;
    }

    return (
        <div className="w-full h-full p-6">
            <Card className="w-full h-full flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-6 border-b">
                    <div className="flex-1">
                        <CardTitle className="text-2xl font-bold">Informações do Produtor</CardTitle>
                        <CardDescription className="mt-2 text-base">
                            {isEditing
                                ? "Edite as informações do seu perfil"
                                : "Gerencie as informações da sua loja"
                            }
                        </CardDescription>
                    </div>
                    {!isEditing && (
                        <Button onClick={handleEdit} variant="outline" size="default" className="ml-4">
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="flex-1 pt-8">
                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}
                    {isEditing ? (
                        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="h-full flex flex-col">
                            <FieldGroup className="gap-8 flex-1">
                                {/* Nome do Produtor */}
                                <Field className="gap-3">
                                    <FieldLabel htmlFor="name" className="text-base font-semibold">
                                        Nome do Produtor <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Digite o nome completo"
                                        className="h-11 text-base"
                                    />
                                </Field>

                                {/* Telefone de Contato */}
                                <Field className="gap-3">
                                    <FieldLabel htmlFor="phone" className="text-base font-semibold">
                                        Telefone de Contato <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="(00) 00000-0000"
                                        className="h-11 text-base"
                                    />
                                </Field>

                                {/* Cidade */}
                                <Field className="gap-3">
                                    <FieldLabel htmlFor="city" className="text-base font-semibold">
                                        Cidade <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                        id="city"
                                        name="city"
                                        type="text"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Digite a cidade"
                                        className="h-11 text-base"
                                    />
                                </Field>

                                {/* Email */}
                                <Field className="gap-3">
                                    <FieldLabel htmlFor="email" className="text-base font-semibold">Email</FieldLabel>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="seuemail@example.com"
                                        className="h-11 text-base"
                                    />
                                </Field>

                                {/* CPF/CNPJ */}
                                <Field className="gap-3">
                                    <FieldLabel htmlFor="cpf_cnpj" className="text-base font-semibold">CPF/CNPJ</FieldLabel>
                                    <Input
                                        id="cpf_cnpj"
                                        name="cpf_cnpj"
                                        type="text"
                                        value={formData.cpf_cnpj}
                                        onChange={handleChange}
                                        placeholder="000.000.000-00"
                                        disabled
                                        className="h-11 text-base bg-muted cursor-not-allowed"
                                    />
                                    <p className="text-sm text-muted-foreground mt-1">
                                        CPF/CNPJ não pode ser alterado
                                    </p>
                                </Field>

                                {/* Endereço */}
                                <Field className="gap-3">
                                    <FieldLabel htmlFor="address" className="text-base font-semibold">Endereço Completo</FieldLabel>
                                    <Input
                                        id="address"
                                        name="address"
                                        type="text"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Rua, número - bairro"
                                        className="h-11 text-base"
                                    />
                                </Field>
                            </FieldGroup>

                            {/* Botões de Ação */}
                            <div className="flex gap-4 pt-8 mt-auto border-t">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 h-11 text-base"
                                >
                                    <Check className="mr-2 h-5 w-5" />
                                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="flex-1 h-11 text-base"
                                >
                                    <X className="mr-2 h-5 w-5" />
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="h-full">
                            {/* Visualização dos dados */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                        Nome do Produtor
                                    </p>
                                    <p className="text-lg font-bold">{producerData.name}</p>
                                </div>

                                <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                        Telefone de Contato
                                    </p>
                                    <p className="text-lg font-bold">{producerData.phone}</p>
                                </div>

                                <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                        Cidade
                                    </p>
                                    <p className="text-lg font-bold">{producerData.city}</p>
                                </div>

                                <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                        Email
                                    </p>
                                    <p className="text-lg font-bold break-all">{producerData.email}</p>
                                </div>

                                <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                        CPF/CNPJ
                                    </p>
                                    <p className="text-lg font-bold">{producerData.cpf_cnpj}</p>
                                </div>

                                {producerData.address && (
                                    <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                            Endereço
                                        </p>
                                        <p className="text-lg font-bold">{producerData.address}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
