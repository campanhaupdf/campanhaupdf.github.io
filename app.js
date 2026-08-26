const form=document.getElementById("cadastroForm"),statusEl=document.getElementById("status");
const checked=n=>[...document.querySelectorAll(`input[name="${n}"]:checked`)].map(x=>x.value);
const msg=(t,ok=false)=>{statusEl.textContent=t;statusEl.style.color=ok?"#18733b":"#d71920"};
form.addEventListener("submit",async e=>{
 e.preventDefault();
 const dias=checked("dias"),horarios=checked("horarios");
 if(!dias.length)return msg("Escolha pelo menos um dia.");
 if(!horarios.length&&!form.horario_especifico.value.trim())return msg("Informe pelo menos um horário.");
 if(SUPABASE_URL.includes("COLE_SUA")||SUPABASE_ANON_KEY.includes("COLE_SUA"))return msg("Configure o Supabase no arquivo config.js.");
 const data={nome:form.nome.value.trim(),whatsapp:form.whatsapp.value.trim(),regiao:form.regiao.value.trim(),local:form.local.value.trim(),dias:dias.join(", "),horarios:horarios.join(", "),horario_especifico:form.horario_especifico.value.trim(),observacoes:form.observacoes.value.trim()};
 try{
  const r=await fetch(`${SUPABASE_URL}/rest/v1/disponibilidades`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_ANON_KEY,"Authorization":`Bearer ${SUPABASE_ANON_KEY}`,"Prefer":"return=minimal"},body:JSON.stringify(data)});
  if(!r.ok)throw new Error();
  form.reset();msg("Cadastro enviado! Obrigado por construir a campanha com a UP. ✊",true);
 }catch(err){msg("Não foi possível enviar. Tente novamente.")}
});
