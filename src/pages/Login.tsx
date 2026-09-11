import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  GlobalStyles,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowForward,
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */

const COLORS = {
  navy: "#0B1C39",
  navyDeep: "#081428",
  slate: "#142A4F",
  leaf: "#3FA34D",
  leafDeep: "#2C7A38",
  ink: "#10192E",
  mist: "#F4F6F9",
  line: "#E2E7EF",
  muted: "#8B96AC",
} as const;

const FONT_FAMILY =
  '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const DASHBOARD_ROUTE = "/dashboard";
const EMAIL_LABEL_ID = "login-email-label";
const PASSWORD_LABEL_ID = "login-password-label";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GLOBAL_STYLES = {
  "html, body, #root": { margin: 0, padding: 0, width: "100%", height: "100%" },
  "*, *::before, *::after": { boxSizing: "border-box" },
  body: { overflowX: "hidden" },
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface LoginFormState {
  email: string;
  password: string;
  remember: boolean;
}

type LoginField = "email" | "password";
type LoginFormErrors = Partial<Record<LoginField, string>>;

const INITIAL_FORM: LoginFormState = { email: "", password: "", remember: false };

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

function validateLoginForm(values: LoginFormState): LoginFormErrors {
  const errors: LoginFormErrors = {};
  const email = values.email.trim();

  if (!email) {
    errors.email = "Email address is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  }

  return errors;
}

/* ------------------------------------------------------------------ */
/*  Reusable styles                                                    */
/* ------------------------------------------------------------------ */

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: COLORS.mist,
    borderRadius: "10px",
    "& fieldset": { borderColor: COLORS.line },
    "&:hover fieldset": { borderColor: COLORS.leaf },
    "&.Mui-focused fieldset": {
      borderColor: COLORS.leaf,
      borderWidth: "1.5px",
    },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const updateField = <K extends keyof LoginFormState>(
    field: K,
    value: LoginFormState[K],
  ): void => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (field === "email") setErrors((prev) => ({ ...prev, email: undefined }));
    if (field === "password") setErrors((prev) => ({ ...prev, password: undefined }));
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) =>
    updateField("email", event.target.value);

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) =>
    updateField("password", event.target.value);

  const handleRememberChange = (event: ChangeEvent<HTMLInputElement>) =>
    updateField("remember", event.target.checked);

  const togglePasswordVisibility = () => setShowPassword((visible) => !visible);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateLoginForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    // TODO: replace with real authentication.
    navigate(DASHBOARD_ROUTE, { replace: true });
  };

  const labelSx = {
    color: COLORS.ink,
    fontSize: "0.82rem",
    fontWeight: 600,
    mb: 0.8,
  };

  return (
    <>
      <GlobalStyles styles={GLOBAL_STYLES} />

      <Box
        sx={{
          width: "100%",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          overflowX: "hidden",
          fontFamily: FONT_FAMILY,
        }}
      >
        {/* ---------------- LEFT PANEL ---------------- */}
        <Box
          component="aside"
          sx={{
            position: "relative",
            overflow: "hidden",
            width: { xs: "100%", md: "46%" },
            minHeight: { xs: 220, sm: 280, md: "100dvh" },
            background: `linear-gradient(160deg, ${COLORS.navy} 0%, ${COLORS.navyDeep} 100%)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: { xs: "center", md: "space-between" },
            px: { xs: 4, sm: 6, md: 7 },
            py: { xs: 5, md: 7 },
          }}
        >
          {/* decorative leaf-vein */}
          <Box
            component="svg"
            viewBox="0 0 400 700"
            aria-hidden="true"
            focusable="false"
            sx={{
              position: "absolute",
              right: { xs: -140, md: -110 },
              bottom: { xs: -160, md: -80 },
              width: { xs: 320, md: 460 },
              height: "auto",
              opacity: 0.16,
              pointerEvents: "none",
            }}
          >
            <path
              d="M60 650 C 40 500, 120 420, 100 260 C 85 140, 180 60, 260 20"
              fill="none"
              stroke={COLORS.leaf}
              strokeWidth={3}
            />
            <path d="M100 500 C 150 480, 170 440, 150 400" fill="none" stroke={COLORS.leaf} strokeWidth={2.5} />
            <path d="M95 350 C 145 335, 165 300, 150 260" fill="none" stroke={COLORS.leaf} strokeWidth={2.5} />
            <path d="M115 220 C 160 210, 180 180, 168 145" fill="none" stroke={COLORS.leaf} strokeWidth={2.5} />
          </Box>

          {/* wordmark */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              gap: 1.2,
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                width: 10,
                height: 10,
                borderRadius: "3px",
                backgroundColor: COLORS.leaf,
                transform: "rotate(45deg)",
              }}
            />
            <Typography
              component="span"
              sx={{ color: "#fff", fontWeight: 600, fontSize: "1.05rem", letterSpacing: "0.02em" }}
            >
              FLIQMARINE
            </Typography>
          </Box>

          {/* pitch */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              display: { xs: "none", sm: "block" },
              mt: { xs: 4, md: 0 },
            }}
          >
            <Typography
              component="h2"
              sx={{
                color: "#fff",
                fontWeight: 600,
                fontSize: { sm: "1.9rem", md: "2.3rem" },
                lineHeight: 1.25,
                maxWidth: 380,
                m: 0,
              }}
            >
              Operations, budgets, and teams —
              <Box component="span" sx={{ color: COLORS.leaf }}>
                {" "}
                one place to run it all.
              </Box>
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "0.98rem",
                lineHeight: 1.7,
                maxWidth: 340,
                mt: 2.5,
              }}
            >
              Sign in with your company account to reach dashboards, approvals,
              and reports assigned to your role.
            </Typography>
          </Box>

          {/* footer */}
          <Box sx={{ position: "relative", zIndex: 1, display: { xs: "none", md: "block" } }}>
            <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem" }}>
              © {new Date().getFullYear()} FLIQMARINE.
            </Typography>
          </Box>
        </Box>

        {/* ---------------- RIGHT PANEL ---------------- */}
        <Box
          component="main"
          sx={{
            width: { xs: "100%", md: "54%" },
            minHeight: { xs: "auto", md: "100dvh" },
            backgroundColor: COLORS.mist,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 3, sm: 6 },
            py: { xs: 6, md: 4 },
          }}
        >
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              width: "100%",
              maxWidth: 500,
              backgroundColor: "#fff",
              borderRadius: "16px",
              border: `1px solid ${COLORS.line}`,
              boxShadow: "0 6px 24px rgba(11, 28, 57, 0.08)",
              px: { xs: 4, sm: 7 },
              py: { xs: 5, sm: 6.5 },
            }}
          >
            <Typography
              component="h1"
              sx={{ color: COLORS.ink, fontWeight: 700, fontSize: "1.6rem", mb: 0.6 }}
            >
              Sign in
            </Typography>
            <Typography sx={{ color: COLORS.muted, fontSize: "0.92rem", mb: 4 }}>
              Enter your work email and password to continue.
            </Typography>

            {/* Email */}
            <Typography id={EMAIL_LABEL_ID} component="p" sx={labelSx}>
              Email address
            </Typography>
            <TextField
              id="login-email"
              fullWidth
              required
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleEmailChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              slotProps={{
                htmlInput: { "aria-labelledby": EMAIL_LABEL_ID },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined sx={{ color: COLORS.muted, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ ...textFieldSx, mb: 2.5 }}
            />

            {/* Password */}
            <Typography id={PASSWORD_LABEL_ID} component="p" sx={labelSx}>
              Password
            </Typography>
            <TextField
              id="login-password"
              fullWidth
              required
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handlePasswordChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              slotProps={{
                htmlInput: { "aria-labelledby": PASSWORD_LABEL_ID },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: COLORS.muted, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        size="small"
                        aria-pressed={showPassword}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <VisibilityOff sx={{ fontSize: 19, color: COLORS.muted }} />
                        ) : (
                          <Visibility sx={{ fontSize: 19, color: COLORS.muted }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ ...textFieldSx, mb: 1.5 }}
            />

            {/* Remember me */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3.5,
                flexWrap: "wrap",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.remember}
                    onChange={handleRememberChange}
                    size="small"
                    sx={{
                      color: COLORS.line,
                      "&.Mui-checked": { color: COLORS.leaf },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: "0.86rem", color: COLORS.ink }}>
                    Remember me
                  </Typography>
                }
              />
            </Box>

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              endIcon={<ArrowForward sx={{ fontSize: 18 }} />}
              sx={{
                backgroundColor: COLORS.navy,
                color: "#fff",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                borderRadius: "10px",
                py: 1.3,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: COLORS.leafDeep,
                  boxShadow: "none",
                },
              }}
            >
              Sign in
            </Button>

            <Divider sx={{ my: 3.5, borderColor: COLORS.line }} />

            {/* Support note */}
            <Box
              sx={{
                backgroundColor: COLORS.mist,
                border: `1px solid ${COLORS.line}`,
                borderRadius: "10px",
                px: 2.2,
                py: 1.6,
                textAlign: "center",
              }}
            >
              <Typography sx={{ fontSize: "0.85rem", color: COLORS.muted, lineHeight: 1.6 }}>
                Can&apos;t sign in?{" "}
                <Link
                  href="#"
                  underline="hover"
                  sx={{ color: COLORS.leafDeep, fontWeight: 600 }}
                >
                  Contact your administrator
                </Link>{" "}
                for access.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}