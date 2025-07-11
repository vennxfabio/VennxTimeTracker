export const VENNX_COLORS = {
  blue: '#2563eb', // Primary blue
  gray: '#64748b', // Text gray
  green: '#059669', // Success green
  warning: '#f59e0b', // Warning orange
  light: '#f8fafc', // Background light
  red: '#dc2626', // Error red
} as const;

export const USER_ROLES = {
  BASIC: 'basic',
  ADVANCED: 'advanced',
} as const;

export const ENTRY_TYPES = {
  PROJECT: 'project',
  VACATION: 'vacation',
  LEAVE: 'leave',
  HOUR_BANK: 'hour_bank',
} as const;

export const PROJECT_TYPES = {
  SOX: 'SOX',
  LGPD: 'LGPD',
  AUDITORIA: 'Auditoria',
  CONSULTORIA: 'Consultoria',
  VAR: 'VAR',
  BPO: 'BPO',
} as const;

export const VACATION_TYPES = {
  VACATION: 'vacation',
  SICK_LEAVE: 'sick_leave',
  PERSONAL_LEAVE: 'personal_leave',
} as const;

export const PROJECT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
} as const;

export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const WORK_HOURS = {
  MINIMUM_DAILY: 8,
  MAXIMUM_DAILY: 24,
} as const;

export const CHART_PERIODS = {
  THREE_MONTHS: 3,
  SIX_MONTHS: 6,
  ONE_YEAR: 12,
} as const;

export const MENU_ITEMS = {
  BASIC: [
    { path: '/time-entry', label: 'Lançamento de Horas', icon: 'Clock' }
  ],
  ADVANCED: [
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/time-entry', label: 'Lançamento de Horas', icon: 'Clock' },
    { path: '/resource-planning', label: 'Programação de Recursos', icon: 'Calendar' },
    { path: '/project-management', label: 'Cadastro de Projetos', icon: 'FolderKanban' },
    { path: '/team-management', label: 'Cadastro de Profissionais', icon: 'Users' },
    { path: '/administration', label: 'Administração', icon: 'Settings' },
  ]
} as const;

export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  API: 'yyyy-MM-dd',
  MONTH_YEAR: 'MMMM yyyy',
} as const;

export const TOAST_MESSAGES = {
  SAVE_SUCCESS: 'Dados salvos com sucesso!',
  SAVE_ERROR: 'Erro ao salvar dados. Tente novamente.',
  DELETE_SUCCESS: 'Item removido com sucesso!',
  DELETE_ERROR: 'Erro ao remover item. Tente novamente.',
  UNAUTHORIZED: 'Você não tem permissão para realizar esta ação.',
  LOGIN_REQUIRED: 'É necessário fazer login para continuar.',
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_EMAIL: 'Email inválido',
  MINIMUM_HOURS: 'Em dias úteis é necessário lançar ao menos 8 horas',
  MAXIMUM_HOURS: 'Não é possível lançar mais de 24 horas por dia',
  INVALID_DATE: 'Data inválida',
  FUTURE_DATE: 'Não é possível lançar horas para datas futuras',
} as const;
