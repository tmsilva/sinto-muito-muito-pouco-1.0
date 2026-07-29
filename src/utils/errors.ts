export class BaseError extends Error {
  public friendlyMessage: string;
  public status: number;

  constructor(message: string, friendlyMessage: string, status: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.friendlyMessage = friendlyMessage;
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AIError extends BaseError {
  constructor(message: string, friendlyMessage = 'Falha na comunicação com o serviço de Inteligência Artificial.') {
    super(message, friendlyMessage, 502);
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, friendlyMessage = 'Os dados informados são inválidos.') {
    super(message, friendlyMessage, 400);
  }
}

export class RepositoryError extends BaseError {
  constructor(message: string, friendlyMessage = 'Falha ao acessar ou persistir dados no banco de dados.') {
    super(message, friendlyMessage, 500);
  }
}

export class ConfigurationError extends BaseError {
  constructor(message: string, friendlyMessage = 'Falha nas configurações de sistema da aplicação.') {
    super(message, friendlyMessage, 500);
  }
}

export interface ServiceResponse<T> {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: T | null;
  error: {
    message: string;
    friendlyMessage: string;
    stack?: string;
  } | null;
}

export const createSuccessResponse = <T>(data: T): ServiceResponse<T> => ({
  status: 'success',
  data,
  error: null
});

export const createErrorResponse = (error: any): ServiceResponse<any> => {
  const friendly = error instanceof BaseError 
    ? error.friendlyMessage 
    : 'Ocorreu um erro inesperado no sistema.';
  
  return {
    status: 'error',
    data: null,
    error: {
      message: error.message || String(error),
      friendlyMessage: friendly,
      stack: error.stack
    }
  };
};
