import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError, mapFieldErrors } from '@/api/errors'
import { useAuth } from '@/auth/useAuth'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import type { UserRole } from '@/api/types'
import './AuthForm.css'

const loginSchema = z.object({
  email: z.email('Masukkan email yang valid.'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

function roleHome(role: UserRole): string {
  return role === 'ADMIN' ? '/admin' : '/dashboard'
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [generalError, setGeneralError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    setGeneralError(null)
    try {
      const user = await login(values)
      navigate(roleHome(user.role), { replace: true })
    } catch (error) {
      const message = mapFieldErrors(
        error,
        (field, message) => setError(field as keyof LoginFormValues, { type: 'server', message }),
        ['email', 'password'],
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
      <h2 className="lc-auth-form__title">Masuk</h2>
      <p className="lc-auth-form__subtitle">Masuk untuk mengelola laporan kehilangan Anda.</p>

      {generalError ? (
        <Alert tone="danger" title="Gagal masuk">
          {generalError}
        </Alert>
      ) : null}

      <form onSubmit={onSubmit} noValidate>
        <FormField label="Email" htmlFor="login-email" required error={errors.email?.message}>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="nama@kampus.ac.id"
            invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </FormField>

        <FormField
          label="Kata Sandi"
          htmlFor="login-password"
          required
          error={errors.password?.message}
        >
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            placeholder="Minimal 8 karakter"
            invalid={Boolean(errors.password)}
            {...register('password')}
          />
        </FormField>

        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={isSubmitting}
          loadingLabel="Memproses..."
        >
          Masuk
        </Button>
      </form>

      <p className="lc-auth-form__footer">
        Belum punya akun?{' '}
        <Link to="/register" className="lc-auth-form__link">
          Daftar di sini
        </Link>
      </p>
    </div>
  )
}
