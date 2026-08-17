import Swal from 'sweetalert2';

const Alert = {
  success: async ({
    title = 'Operación exitosa',
    text = '',
    confirmText = 'Aceptar',
  } = {}) => {
    return await Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonText: confirmText,
      confirmButtonColor: '#2563eb',
    });
  },

  error: async ({
    title = 'Ha ocurrido un error',
    text = '',
    confirmText = 'Aceptar',
  } = {}) => {
    return await Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonText: confirmText,
      confirmButtonColor: '#dc2626',
    });
  },

  warning: async ({
    title = 'Advertencia',
    text = '',
    confirmText = 'Aceptar',
  } = {}) => {
    return await Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonText: confirmText,
      confirmButtonColor: '#f59e0b',
    });
  },

  info: async ({
    title = 'Información',
    text = '',
    confirmText = 'Aceptar',
  } = {}) => {
    return await Swal.fire({
      icon: 'info',
      title,
      text,
      confirmButtonText: confirmText,
      confirmButtonColor: '#2563eb',
    });
  },

  question: async ({
    title = '¿Está seguro?',
    text = '',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
  } = {}) => {
    return await Swal.fire({
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
    });
  },
};

export default Alert;