import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError, mapFieldErrors } from '@/api/errors'
import { useAuth } from '@/auth/useAuth'
import { useToast } from '@/components/ui/useToast'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import './AuthForm.css'

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Nama minimal 2 karakter.')
      .max(100, 'Nama maksimal 100 karakter.'),
    email: z.email('Masukkan email yang valid.'),
    password: z.string().min(8, 'Kata sandi minimal 8 karakter.'),
    passwordConfirmation: z.string(),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Konfirmasi kata sandi tidak sama.',
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterPage() {
  const { register: registerUser } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [generalError, setGeneralError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', passwordConfirmation: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    setGeneralError(null)
    try {
      await registerUser({ name: values.name, email: values.email, password: values.password })
      toast('Pendaftaran berhasil. Silakan masuk.', { tone: 'success' })
      navigate('/login')
    } catch (error) {
      const message = mapFieldErrors(
        error,
        (field, message) =>
          setError(field as keyof RegisterFormValues, { type: 'server', message }),
        ['name', 'email', 'password'],
      )
      if (message) {
        setGeneralError(message)
      } else if (!(error instanceof ApiError)) {
        setGeneralError('Terjadi kesalahan. Silakan coba lagi.')
      }
    }
  })

  return (
    <div className="lc-auth-form">
      <h2 className="lc-auth-form__title">Daftar</h2>
      <p className="lc-auth-form__subtitle">Buat akun untuk melaporkan dan mengklaim barang.</p>

      {generalError ? (
        <Alert tone="danger" title="Gagal mendaftar">
          {generalError}
        </Alert>
      ) : null}

      <form onSubmit={onSubmit} noValidate>
        <FormField
          label="Nama Lengkap"
          htmlFor="register-name"
          required
          error={errors.name?.message}
        >
          <Input
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder="Nama Anda"
            invalid={Boolean(errors.name)}
            {...register('name')}
          />
        </FormField>

        <FormField label="Email" htmlFor="register-email" required error={errors.email?.message}>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="nama@kampus.ac.id"
            invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </FormField>

        <FormField
          label="Kata Sandi"
          htmlFor="register-password"
          required
          helper="Minimal 8 karakter."
          error={errors.password?.message}
        >
          <PasswordInput
            id="register-password"
            autoComplete="new-password"
            placeholder="Minimal 8 karakter"
            invalid={Boolean(errors.password)}
            {...register('password')}
          />
        </FormField>

        <FormField
          label="Konfirmasi Kata Sandi"
          htmlFor="register-password-confirmation"
          required
          error={errors.passwordConfirmation?.message}
        >
          <PasswordInput
            id="register-password-confirmation"
            autoComplete="new-password"
            placeholder="Ulangi kata sandi"
            invalid={Boolean(errors.passwordConfirmation)}
            {...register('passwordConfirmation')}
          />
        </FormField>

        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={isSubmitting}
          loadingLabel="Memproses..."
        >
          Daftar
        </Button>
      </form>

      <p className="lc-auth-form__footer">
        Sudah punya akun?{' '}
        <Link to="/login" className="lc-auth-form__link">
          Masuk di sini
        </Link>
      </p>
    </div>
  )
}
