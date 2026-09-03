/* =========================================================
   ADMINISTRAÇÃO
========================================================= */

const supabaseHeaders = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": "Bearer " + SUPABASE_ANON_KEY
};


/* =========================================================
   ELEMENTOS
========================================================= */

const loginArea = document.getElementById("login-area");
const painel = document.getElementById("painel");

const loginForm = document.getElementById("login-form");
const loginStatus = document.getElementById("login-status");

const listaCadastros =
    document.getElementById("lista-cadastros");

const contador =
    document.getElementById("contador");

const busca =
    document.getElementById("busca");

const filtroLocal =
    document.getElementById("filtro-local");

const filtroDia =
    document.getElementById("filtro-dia");

const filtroTurno =
    document.getElementById("filtro-turno");

const atualizar =
    document.getElementById("atualizar");

const sair =
    document.getElementById("sair");

let cadastros = [];


/* =========================================================
   VERIFICAR LOGIN
========================================================= */

async function verificarLogin() {

    const resposta = await fetch(
        SUPABASE_URL + "/auth/v1/user",
        {
            headers: supabaseHeaders
        }
    );

    if (resposta.ok) {

        mostrarPainel();
        carregarCadastros();

    } else {

        mostrarLogin();

    }

}


/* =========================================================
   MOSTRAR LOGIN
========================================================= */

function mostrarLogin() {

    loginArea.classList.remove("escondido");
    painel.classList.add("escondido");
    sair.classList.add("escondido");

}


/* =========================================================
   MOSTRAR PAINEL
========================================================= */

function mostrarPainel() {

    loginArea.classList.add("escondido");
    painel.classList.remove("escondido");
    sair.classList.remove("escondido");

}


/* =========================================================
   LOGIN
========================================================= */

loginForm.addEventListener(
    "submit",
    async function (evento) {

        evento.preventDefault();

        loginStatus.textContent = "Entrando...";

        const email =
            document.getElementById("email").value.trim();

        const senha =
            document.getElementById("senha").value;

        try {

            const resposta = await fetch(
                SUPABASE_URL + "/auth/v1/token?grant_type=password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "apikey": SUPABASE_ANON_KEY
                    },

                    body: JSON.stringify({
                        email: email,
                        password: senha
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.msg ||
                    dados.message ||
                    "E-mail ou senha incorretos."
                );
            }

            localStorage.setItem(
                "supabase_access_token",
                dados.access_token
            );

            localStorage.setItem(
                "supabase_refresh_token",
                dados.refresh_token
            );

            loginStatus.textContent = "";

            verificarLogin();

        } catch (erro) {

            console.error(erro);

            loginStatus.textContent =
                erro.message;

        }

    }
);


/* =========================================================
   HEADERS COM TOKEN
========================================================= */

function headersAutenticados() {

    const token =
        localStorage.getItem(
            "supabase_access_token"
        );

    return {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": "Bearer " + token
    };

}


/* =========================================================
   CARREGAR CADASTROS
========================================================= */

async function carregarCadastros() {

    const status =
        document.getElementById("status");

    status.textContent =
        "Carregando cadastros...";

    try {

        const resposta = await fetch(
            SUPABASE_URL +
            "/rest/v1/disponibilidades?select=*&order=id.desc",
            {
                headers: headersAutenticados()
            }
        );

        if (!resposta.ok) {

            throw new Error(
                await resposta.text()
            );

        }

        cadastros = await resposta.json();

        status.textContent = "";

        criarFiltroLocais();

        aplicarFiltros();

    } catch (erro) {

        console.error(erro);

        status.textContent =
            "Não foi possível carregar os cadastros.";

    }

}


/* =========================================================
   CRIAR FILTRO DE LOCAIS
========================================================= */

function criarFiltroLocais() {

    const locais = new Set();

    cadastros.forEach(cadastro => {

        if (Array.isArray(cadastro.local)) {

            cadastro.local.forEach(local => {
                locais.add(local);
            });

        } else if (cadastro.local) {

            locais.add(cadastro.local);

        }

    });

    filtroLocal.innerHTML =
        '<option value="">Todos os locais</option>';

    [...locais]
        .sort()
        .forEach(local => {

            const option =
                document.createElement("option");

            option.value = local;
            option.textContent = local;

            filtroLocal.appendChild(option);

        });

}


/* =========================================================
   FILTRAR
========================================================= */

function aplicarFiltros() {

    const texto =
        busca.value
            .trim()
            .toLowerCase();

    const local =
        filtroLocal.value;

    const dia =
        filtroDia.value;

    const turno =
        filtroTurno.value;

    const filtrados =
        cadastros.filter(cadastro => {

            const nome =
                (cadastro.nome || "")
                    .toLowerCase();

            const whatsapp =
                (cadastro.whatsapp || "")
                    .toLowerCase();

            const regiao =
                (cadastro.regiao || "")
                    .toLowerCase();

            const correspondeTexto =
                !texto ||
                nome.includes(texto) ||
                whatsapp.includes(texto) ||
                regiao.includes(texto);


            const locaisCadastro =
                Array.isArray(cadastro.local)
                    ? cadastro.local
                    : [cadastro.local];


            const correspondeLocal =
                !local ||
                locaisCadastro.includes(local);


            let correspondeDia = true;
            let correspondeTurno = true;


            if (dia) {

                const dadosDia =
                    cadastro.dias?.[dia];

                if (!dadosDia) {

                    correspondeDia = false;

                } else {

                    if (turno) {

                        correspondeTurno =
                            dadosDia[turno] === true;

                    } else {

                        correspondeDia =
                            dadosDia.manha ||
                            dadosDia.tarde ||
                            dadosDia.noite;

                    }

                }

            }


            return (
                correspondeTexto &&
                correspondeLocal &&
                correspondeDia &&
                correspondeTurno
            );

        });


    renderizar(filtrados);

}


/* =========================================================
   RENDERIZAR
========================================================= */

function renderizar(lista) {

    contador.textContent =
        lista.length;

    if (lista.length === 0) {

        listaCadastros.innerHTML = `
            <div class="cadastro-card">
                <strong>Nenhum cadastro encontrado.</strong>
            </div>
        `;

        return;

    }


    listaCadastros.innerHTML =
        lista.map(cadastro => {

            const locais =
                Array.isArray(cadastro.local)
                    ? cadastro.local.join(", ")
                    : cadastro.local || "Não informado";


            const diasHTML =
                gerarDiasHTML(cadastro.dias);


            return `

                <article class="cadastro-card">

                    <div class="cadastro-topo">

                        <div>

                            <h2 class="cadastro-nome">
                                ${escapar(cadastro.nome)}
                            </h2>

                            <div class="cadastro-contato">
                                ${escapar(cadastro.whatsapp)}
                                ·
                                ${escapar(cadastro.regiao)}
                            </div>

                        </div>

                    </div>


                    <div class="info">

                        <strong>Locais</strong>

                        <span>
                            ${escapar(locais)}
                        </span>

                    </div>


                    <div class="info">

                        <strong>Disponibilidade</strong>

                        <div class="disponibilidade-admin">

                            ${diasHTML}

                        </div>

                    </div>


                    <div class="info">

                        <strong>Observações</strong>

                        <span>
                            ${escapar(
                                cadastro.observacoes ||
                                "Nenhuma"
                            )}
                        </span>

                    </div>

                </article>

            `;

        }).join("");

}


/* =========================================================
   DIAS
========================================================= */

function gerarDiasHTML(dias) {

    if (!dias) {
        return '<span class="vazio">Não informado</span>';
    }

    const nomes = {
        segunda: "Segunda",
        terca: "Terça",
        quarta: "Quarta",
        quinta: "Quinta",
        sexta: "Sexta",
        sabado: "Sábado",
        domingo: "Domingo"
    };

    return Object.entries(dias)
        .map(([chave, dados]) => {

            const turnos = [];

            if (dados.manha) {
                turnos.push("☀ manhã");
            }

            if (dados.tarde) {
                turnos.push("◐ tarde");
            }

            if (dados.noite) {
                turnos.push("☾ noite");
            }

            if (
                turnos.length === 0 &&
                !dados.horario
            ) {
                return "";
            }

            let texto =
                turnos.join(" · ");

            if (dados.horario) {

                texto +=
                    " · " +
                    escapar(dados.horario);

            }

            return `

                <div class="dia-admin">

                    <strong>
                        ${nomes[chave] || chave}
                    </strong>

                    <span>
                        ${texto}
                    </span>

                </div>

            `;

        })
        .join("");

}


/* =========================================================
   SEGURANÇA HTML
========================================================= */

function escapar(valor) {

    return String(valor || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   EVENTOS DOS FILTROS
========================================================= */

busca.addEventListener(
    "input",
    aplicarFiltros
);

filtroLocal.addEventListener(
    "change",
    aplicarFiltros
);

filtroDia.addEventListener(
    "change",
    aplicarFiltros
);

filtroTurno.addEventListener(
    "change",
    aplicarFiltros
);

atualizar.addEventListener(
    "click",
    carregarCadastros
);


/* =========================================================
   SAIR
========================================================= */

sair.addEventListener(
    "click",
    async function () {

        localStorage.removeItem(
            "supabase_access_token"
        );

        localStorage.removeItem(
            "supabase_refresh_token"
        );

        mostrarLogin();

    }
);


/* =========================================================
   INICIAR
========================================================= */

verificarLogin();