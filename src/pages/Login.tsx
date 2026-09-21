import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { getTheme } from "../theme/theme"; // adjust path to match your project
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

/* Stagger timing for the "form assembling" entrance. */
const STEP_MS = 90;
const STEPS = {
  mark: 0,
  headline: 1,
  subhead: 2,
  footer: 3,
  card: 1,
  title: 3,
  email: 4,
  password: 5,
  remember: 6,
  submit: 7,
  divider: 8,
  support: 9,
} as const;

const GLOBAL_STYLES = {
  "html, body, #root": { margin: 0, padding: 0, width: "100%", height: "100%" },
  "*, *::before, *::after": { boxSizing: "border-box" },
  body: { overflowX: "hidden" },
  "@keyframes login-compass-spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
  "@keyframes login-route-draw": {
    "0%": { strokeDashoffset: 120 },
    "100%": { strokeDashoffset: 0 },
  },
  "@keyframes login-waypoint-pulse": {
    "0%, 100%": { opacity: 1, transform: "scale(1)" },
    "50%": { opacity: 0.55, transform: "scale(1.35)" },
  },
  "@keyframes login-mark-in": {
    "0%": { opacity: 0, transform: "scale(0.6)" },
    "100%": { opacity: 1, transform: "scale(1)" },
  },
  "@media (prefers-reduced-motion: reduce)": {
    ".login-compass, .login-route, .login-waypoint, .login-mark": {
      animation: "none !important",
      strokeDashoffset: "0 !important",
    },
    ".login-reveal": {
      transition: "none !important",
      opacity: "1 !important",
      transform: "none !important",
    },
  },
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
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    "& fieldset": { borderColor: COLORS.line, transition: "border-color 0.2s ease" },
    "&:hover fieldset": { borderColor: COLORS.leaf },
    "&.Mui-focused fieldset": {
      borderColor: COLORS.leaf,
      borderWidth: "1.5px",
    },
    "&.Mui-focused": {
      boxShadow: `0 0 0 4px ${COLORS.leaf}1f`,
    },
  },
};

function revealSx(mounted: boolean, step: number) {
  return {
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.5s ease ${step * STEP_MS}ms, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${
      step * STEP_MS
    }ms`,
  };
}

/* ------------------------------------------------------------------ */
/*  Logo mark — a plotted course with two waypoints, standing in for   */
/*  "Fliq" (flow) + "Marine" (navigation). Used at wordmark size here; */
/*  the same geometry is exported standalone for favicons/app icons.   */
/* ------------------------------------------------------------------ */

function LogoMark({ animate }: { animate: boolean }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 32 32"
      width={30}
      height={30}
      aria-hidden="true"
      focusable="false"
      className="login-mark"
      sx={{
        opacity: animate ? undefined : 0,
        animation: animate ? "login-mark-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both" : "none",
      }}
    >
      <circle cx="16" cy="16" r="14.5" fill="none" stroke={COLORS.leaf} strokeOpacity={0.32} strokeWidth={1.3} />
      <path
        className="login-route"
        d="M8 21 L14.5 14.5 L19.5 17.5 L25 10.5"
        fill="none"
        stroke={COLORS.leaf}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={30}
        strokeDashoffset={animate ? 0 : 30}
        sx={{ animation: animate ? "login-route-draw 0.9s 0.15s cubic-bezier(0.22, 1, 0.36, 1) both" : "none" }}
      />
      <circle cx="8" cy="21" r="1.7" fill="none" stroke={COLORS.leaf} strokeWidth={1.4} />
      <circle cx="25" cy="10.5" r="2.2" fill={COLORS.leaf} />
    </Box>

  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

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
    <ThemeProvider theme={getTheme("light")}>
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
          {/* decorative chart — a slowly rotating compass ring behind a fixed
              plotted route, echoing the logo instead of unrelated artwork */}
          <Box
            component="svg"
            viewBox="0 0 400 400"
            aria-hidden="true"
            focusable="false"
            sx={{
              position: "absolute",
              right: { xs: -130, md: -90 },
              bottom: { xs: -150, md: -70 },
              width: { xs: 300, md: 420 },
              height: "auto",
              pointerEvents: "none",
            }}
          >
            <g
              className="login-compass"
              sx={{
                transformOrigin: "200px 200px",
                animation: "login-compass-spin 160s linear infinite",
              }}
            >
              <circle cx={200} cy={200} r={150} fill="none" stroke={COLORS.leaf} strokeOpacity={0.14} strokeWidth={1} />
              <circle cx={200} cy={200} r={110} fill="none" stroke={COLORS.leaf} strokeOpacity={0.1} strokeWidth={1} />
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i / 24) * Math.PI * 2;
                const long = i % 6 === 0;
                const outer = 150;
                const inner = long ? 138 : 144;
                return (
                  <line
                    key={i}
                    x1={200 + Math.cos(angle) * outer}
                    y1={200 + Math.sin(angle) * outer}
                    x2={200 + Math.cos(angle) * inner}
                    y2={200 + Math.sin(angle) * inner}
                    stroke={COLORS.leaf}
                    strokeOpacity={long ? 0.28 : 0.14}
                    strokeWidth={1}
                  />
                );
              })}
            </g>

            <path
              d="M110 260 C 150 250, 165 220, 155 190 C 148 168, 175 150, 205 148 C 235 146, 250 120, 244 92"
              fill="none"
              stroke={COLORS.leaf}
              strokeOpacity={0.4}
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray={4}
            />
            <circle cx={110} cy={260} r={4} fill="none" stroke={COLORS.leaf} strokeOpacity={0.55} strokeWidth={1.6} />
            <circle cx={155} cy={190} r={3.5} fill={COLORS.leaf} fillOpacity={0.55} />
            <circle cx={205} cy={148} r={3.5} fill={COLORS.leaf} fillOpacity={0.55} />
            <circle
              className="login-waypoint"
              cx={244}
              cy={92}
              r={5}
              fill={COLORS.leaf}
              sx={{ transformOrigin: "244px 92px", animation: "login-waypoint-pulse 3.4s ease-in-out infinite" }}
            />
          </Box>

          {/* wordmark */}
          <Box
            className="login-reveal"
            sx={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              gap: 1.1,
              ...revealSx(mounted, STEPS.mark),
            }}
          >
            <LogoMark animate={mounted} />
            <Typography
              component="span"
              sx={{ color: "#fff", fontWeight: 600, fontSize: "1.05rem", letterSpacing: "0.03em" }}
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
              className="login-reveal"
              sx={{
                color: "#fff",
                fontWeight: 600,
                fontSize: { sm: "1.9rem", md: "2.3rem" },
                lineHeight: 1.25,
                letterSpacing: "-0.01em",
                maxWidth: 380,
                m: 0,
                ...revealSx(mounted, STEPS.headline),
              }}
            >
              Operations, budgets, and teams —
              <Box component="span" sx={{ color: COLORS.leaf }}>
                {" "}
                one place to run it all.
              </Box>
            </Typography>
            <Typography
              className="login-reveal"
              sx={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "0.98rem",
                lineHeight: 1.7,
                maxWidth: 340,
                mt: 2.5,
                ...revealSx(mounted, STEPS.subhead),
              }}
            >
              Sign in with your company account to reach dashboards, approvals,
              and reports assigned to your role.
            </Typography>
          </Box>

          {/* footer */}
          <Box
            className="login-reveal"
            sx={{
              position: "relative",
              zIndex: 1,
              display: { xs: "none", md: "block" },
              ...revealSx(mounted, STEPS.footer),
            }}
          >
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
            className="login-reveal"
            sx={{
              width: "100%",
              maxWidth: 500,
              backgroundColor: "#fff",
              borderRadius: "16px",
              border: `1px solid ${COLORS.line}`,
              boxShadow: "0 6px 24px rgba(11, 28, 57, 0.08)",
              px: { xs: 4, sm: 7 },
              py: { xs: 5, sm: 6.5 },
              ...revealSx(mounted, STEPS.card),
            }}
          >
            <Typography
              component="h1"
              className="login-reveal"
              sx={{
                color: COLORS.ink,
                fontWeight: 700,
                fontSize: "1.6rem",
                mb: 0.6,
                ...revealSx(mounted, STEPS.title),
              }}
            >
              Sign in
            </Typography>
            <Typography
              className="login-reveal"
              sx={{ color: COLORS.muted, fontSize: "0.92rem", mb: 4, ...revealSx(mounted, STEPS.title) }}
            >
              Enter your work email and password to continue.
            </Typography>

            {/* Email */}
            <Box className="login-reveal" sx={revealSx(mounted, STEPS.email)}>
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
            </Box>

            {/* Password */}
            <Box className="login-reveal" sx={revealSx(mounted, STEPS.password)}>
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
            </Box>

            {/* Remember me */}
            <Box
              className="login-reveal"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3.5,
                flexWrap: "wrap",
                ...revealSx(mounted, STEPS.remember),
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
            <Box className="login-reveal" sx={revealSx(mounted, STEPS.submit)}>
              <Button
                type="submit"
                fullWidth
                endIcon={
                  <ArrowForward
                    className="login-submit-arrow"
                    sx={{ fontSize: 18, transition: "transform 0.25s ease" }}
                  />
                }
                sx={{
                  backgroundColor: COLORS.navy,
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  borderRadius: "10px",
                  py: 1.3,
                  boxShadow: "none",
                  transition: "background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    backgroundColor: COLORS.leafDeep,
                    boxShadow: "0 8px 20px rgba(44, 122, 56, 0.28)",
                    transform: "translateY(-1px)",
                    "& .login-submit-arrow": { transform: "translateX(3px)" },
                  },
                  "&:active": { transform: "translateY(0)" },
                }}
              >
                Sign in
              </Button>
            </Box>

            <Divider
              className="login-reveal"
              sx={{ my: 3.5, borderColor: COLORS.line, ...revealSx(mounted, STEPS.divider) }}
            />

            {/* Support note */}
            <Box
              className="login-reveal"
              sx={{
                backgroundColor: COLORS.mist,
                border: `1px solid ${COLORS.line}`,
                borderRadius: "10px",
                px: 2.2,
                py: 1.6,
                textAlign: "center",
                ...revealSx(mounted, STEPS.support),
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
    </ThemeProvider>
    </>
  );
}