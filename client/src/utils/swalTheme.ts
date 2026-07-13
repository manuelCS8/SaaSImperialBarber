import Swal from 'sweetalert2';

/** Paleta alineada con el panel: slate-950 / emerald-500 */
const theme = {
  background: '#020617',
  color: '#e2e8f0',
  confirmButtonColor: '#10b981',
  cancelButtonColor: '#334155',
};

export function showLoadingAlert(title: string, text: string) {
  return Swal.fire({
    ...theme,
    title,
    html: `<p style="color:#94a3b8;font-size:0.95rem;line-height:1.5">${text}</p>`,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    customClass: {
      popup: 'imperial-swal-popup',
    },
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

export function closeAlert() {
  Swal.close();
}

export function showSuccessAlert(title: string, text: string) {
  return Swal.fire({
    ...theme,
    icon: 'success',
    iconColor: '#34d399',
    title,
    text,
    confirmButtonText: 'Entendido',
    customClass: {
      popup: 'imperial-swal-popup',
      confirmButton: 'imperial-swal-btn',
    },
  });
}

export function showWarningAlert(title: string, text: string) {
  return Swal.fire({
    ...theme,
    icon: 'warning',
    iconColor: '#fbbf24',
    title,
    text,
    confirmButtonText: 'Entendido',
    customClass: {
      popup: 'imperial-swal-popup',
      confirmButton: 'imperial-swal-btn',
    },
  });
}

export function showErrorAlert(title: string, text: string) {
  return Swal.fire({
    ...theme,
    icon: 'error',
    iconColor: '#f87171',
    title,
    text,
    confirmButtonText: 'Cerrar',
    customClass: {
      popup: 'imperial-swal-popup',
      confirmButton: 'imperial-swal-btn',
    },
  });
}
