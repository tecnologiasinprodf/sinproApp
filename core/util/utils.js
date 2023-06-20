export { validateCPF };

function validateCPF(text) {
  let v = text.replace(/\D/g,"");
  v = (v.length > 11) ? v.substring(0, 11) : v;
  v = v.replace(/(\d{3})(\d)/,"$1.$2");
  v = v.replace(/(\d{3})(\d)/,"$1.$2");
  return v.replace(/(\d{3})(\d{1,2})$/,"$1-$2");
}
