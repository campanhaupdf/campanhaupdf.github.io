/* =========================================================
   DIAS DA SEMANA
========================================================= */

const dias = [
    ["segunda", "SEGUNDA"],
    ["terca", "TERÇA"],
    ["quarta", "QUARTA"],
    ["quinta", "QUINTA"],
    ["sexta", "SEXTA"],
    ["sabado", "SÁBADO"],
    ["domingo", "DOMINGO"]
];


/* =========================================================
   CRIAR OS DIAS NO FORMULÁRIO
========================================================= */

const caixaDias = document.getElementById("dias");

caixaDias.innerHTML = dias.map(
    ([chave, nome]) => `

        <div class="dia">

            <div class="dia-titulo">
                ${nome}
            </div>

            <div class="turnos">

                <!-- MANHÃ -->
                <label>
                    <input
                        type="checkbox"
                        name="${chave}_manha"
                    >

                    <span>
                        ☀ MANHÃ
                    </span>
                </label>


                <!-- TARDE -->
                <label>
                    <input
                        type="checkbox"
                        name="${chave}_tarde"
                    >

                    <span>
                        ◐ TARDE
                    </span>
                </label>


                <!-- NOITE -->
                <label>
                    <input
                        type="checkbox"
                        name="${chave}_noite"
                    >

                    <span>
                        ☾ NOITE
                    </span>
                </label>

            </div>


            <!-- HORÁRIO ESPECÍFICO -->
            <input
                class="horario"
                type="text"
                name="${chave}_horario"
                placeholder="Horário específico (opcional)"
            >

        </div>
    `
).join("");


/* =========================================================
   FORMULÁRIO
========================================================= */

const formulario = document.getElementById("cadastroForm");

const status = document.getElementById("status");


/* =========================================================
   ENVIO
========================================================= */

formulario.addEventListener(
    "submit",
    async function (evento) {

        evento.preventDefault();


        /* =================================================
           MONTAR DISPONIBILIDADE
        ================================================== */

        const disponibilidade = {};

        let quantidadeTurnos = 0;


        for (const [chave] of dias) {

            const manha =
                formulario.elements[
                    chave + "_manha"
                ].checked;

            const tarde =
                formulario.elements[
                    chave + "_tarde"
                ].checked;

            const noite =
                formulario.elements[
                    chave + "_noite"
                ].checked;

            const horario =
                formulario.elements[
                    chave + "_horario"
                ].value.trim();


            disponibilidade[chave] = {
                manha: manha,
                tarde: tarde,
                noite: noite,
                horario: horario
            };


            quantidadeTurnos +=
                Number(manha) +
                Number(tarde) +
                Number(noite);
        }


        /* =================================================
           VALIDAR TURNOS
        ================================================== */

        if (quantidadeTurnos === 0) {

            status.textContent =
                "Marque pelo menos um turno.";

            return;
        }


        /* =================================================
           VERIFICAR SUPABASE
        ================================================== */

        if (
            typeof SUPABASE_URL === "undefined" ||
            SUPABASE_URL.includes("COLE_SUA")
        ) {

            status.textContent =
                "Configure o Supabase no config.js para ativar o envio.";

            return;
        }


        /* =================================================
           PEGAR DADOS
        ================================================== */

        const dados = {

            nome:
                formulario.nome.value.trim(),

            whatsapp:
                formulario.whatsapp.value.trim(),

            regiao:
                formulario.regiao.value.trim(),

            local:
                formulario.local.value.trim(),

            disponibilidade:
                disponibilidade,

            observacoes:
                formulario.observacoes.value.trim()

        };


        status.textContent = "Enviando...";


        /* =================================================
           ENVIAR PARA O SUPABASE
        ================================================== */

        try {

            const resposta = await fetch(
                SUPABASE_URL +
                "/rest/v1/disponibilidades",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",

                        "apikey":
                            SUPABASE_ANON_KEY,

                        "Authorization":
                            "Bearer " +
                            SUPABASE_ANON_KEY,

                        "Prefer":
                            "return=minimal"
                    },

                    body:
                        JSON.stringify(dados)
                }
            );


            /* =================================================
               VERIFICAR RESPOSTA
            ================================================== */

            if (!resposta.ok) {

                throw new Error(
                    await resposta.text()
                );
            }


            /* =================================================
               SUCESSO
            ================================================== */

            formulario.reset();

            status.textContent =
                "Cadastro enviado com sucesso!";


        } catch (erro) {

            console.error(erro);

            status.textContent =
                "Não foi possível enviar. Verifique o Supabase.";
        }
    }
);
