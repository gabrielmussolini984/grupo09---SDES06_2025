import { test, expect } from "@playwright/test";

test("Teste Usuarios", async ({ page }) => {
  await page.goto("http://localhost:8081/");
  await page.getByRole("link", { name: "Usuários", exact: true }).click();
  await page.getByRole("button", { name: "Novo Usuário" }).click();
  await page.getByRole("textbox", { name: "Nome Completo *" }).click();
  await page
    .getByRole("textbox", { name: "Nome Completo *" })
    .fill("Gabriel Teste");
  await page.getByRole("textbox", { name: "Nome Completo *" }).press("Tab");
  await page.getByRole("textbox", { name: "Usuário *" }).fill("gabriel12345");
  await page.getByRole("textbox", { name: "Usuário *" }).press("Tab");
  await page.getByRole("textbox", { name: "CPF *" }).fill("615.983.920-93");
  await page.getByRole("textbox", { name: "CPF *" }).press("Tab");
  await page
    .getByRole("textbox", { name: "E-mail *" })
    .fill("gabriel984@email.com");
  await page.getByRole("textbox", { name: "E-mail *" }).press("Tab");
  await page
    .getByRole("textbox", { name: "Telefone *" })
    .fill("(12) 99706-2128");
  await page.getByRole("combobox").click();
  await page.getByLabel("Veterinário").getByText("Veterinário").click();
  await page
    .getByRole("textbox", { name: "Data de Admissão *" })
    .fill("2020-02-08");
  await page.getByRole("textbox", { name: "Senha *", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Senha *", exact: true })
    .fill("g@briel984gM");
  await page
    .getByRole("textbox", { name: "Senha *", exact: true })
    .press("Tab");
  await page
    .getByRole("textbox", { name: "Confirmar Senha *" })
    .fill("g@briel984gM");
  await page.getByRole("button", { name: "Cadastrar" }).click();
  await page.getByRole("cell", { name: "gabriel984@email.com" }).click();
  await page.getByRole("button", { name: "Editar" }).nth(1).click();
  await page.getByRole("textbox", { name: "E-mail *" }).click();
  await page.getByRole("textbox", { name: "E-mail *" }).dblclick();
  await page.getByRole("textbox", { name: "E-mail *" }).click();
  await page.getByRole("textbox", { name: "E-mail *" }).press("ArrowLeft");
  await page.getByRole("textbox", { name: "E-mail *" }).press("ArrowLeft");
  await page.getByRole("textbox", { name: "E-mail *" }).press("ArrowLeft");
  await page.getByRole("textbox", { name: "E-mail *" }).press("ArrowLeft");
  await page.getByRole("textbox", { name: "E-mail *" }).press("ArrowLeft");
  await page.getByRole("textbox", { name: "E-mail *" }).press("ArrowLeft");
  await page.getByRole("textbox", { name: "E-mail *" }).press("ArrowLeft");
  await page.getByRole("textbox", { name: "E-mail *" }).press("ArrowLeft");
  await page.getByRole("textbox", { name: "E-mail *" }).press("ArrowLeft");
  await page.getByRole("textbox", { name: "E-mail *" }).press("ArrowLeft");
  await page.getByRole("textbox", { name: "E-mail *" }).press("ArrowLeft");
  await page.getByRole("textbox", { name: "E-mail *" }).press("ArrowRight");
  await page.getByRole("textbox", { name: "E-mail *" }).press("ArrowRight");
  await page
    .getByRole("textbox", { name: "E-mail *" })
    .fill("gabrielmussolini@email.com");
  await page.getByRole("button", { name: "Atualizar" }).click();
  await page.getByRole("button", { name: "Excluir" }).nth(1).click();
  await page.getByRole("button", { name: "Remover" }).click();
  await page.getByRole("textbox", { name: "Buscar por nome..." }).click();
  await page.getByRole("textbox", { name: "Buscar por nome..." }).fill("fu");
  await page.getByRole("textbox", { name: "Buscar por nome..." }).click();
  await page.getByRole("textbox", { name: "Buscar por nome..." }).fill("");
  await page.getByRole("textbox", { name: "CPF (000.000.000-00)" }).click();
  await page
    .getByRole("textbox", { name: "CPF (000.000.000-00)" })
    .fill("13259208607");
  await page.getByRole("textbox", { name: "CPF (000.000.000-00)" }).click();
  await page.getByRole("textbox", { name: "CPF (000.000.000-00)" }).fill("");
  await page.getByRole("combobox").click();
  await page.getByLabel("Administrador").getByText("Administrador").click();
  await page.getByRole("combobox").click();
  await page.getByText("Todos os cargos").click();
});

test("Teste Tutor", async ({ page }) => {
  await page.goto("http://localhost:8081/");
  await page.getByRole("link", { name: "Tutores" }).click();
  await page.getByRole("button", { name: "Novo Tutor" }).click();
  await page.getByRole("textbox", { name: "Nome Completo *" }).click();
  await page
    .getByRole("textbox", { name: "Nome Completo *" })
    .fill("Maria da Silva");
  await page.getByRole("textbox", { name: "CPF *" }).click();
  await page.getByRole("textbox", { name: "CPF *" }).fill("472.899.760-02");
  await page.getByRole("textbox", { name: "E-mail *" }).click();
  await page
    .getByRole("textbox", { name: "E-mail *" })
    .fill("maria.silva@email.com");
  await page.getByRole("textbox", { name: "E-mail *" }).press("Tab");
  await page
    .getByRole("textbox", { name: "Telefone *" })
    .fill("(35) 99784-7474");
  await page
    .getByRole("textbox", { name: "Data de Nascimento *" })
    .fill("2020-01-02");
  await page.getByRole("textbox", { name: "Endereço *" }).click();
  await page
    .getByRole("textbox", { name: "Data de Nascimento *" })
    .fill("1992-01-02");
  await page.getByRole("textbox", { name: "Endereço *" }).click();
  await page
    .getByRole("textbox", { name: "Endereço *" })
    .fill("Rua Xoti 21 Itajuba");
  await page.getByRole("textbox", { name: "Senha *", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Senha *", exact: true })
    .fill("g@briel984gM");
  await page
    .getByRole("textbox", { name: "Senha *", exact: true })
    .press("Tab");
  await page
    .getByRole("textbox", { name: "Confirmar Senha *" })
    .fill("g@briel984gM");
  await page.getByRole("button", { name: "Cadastrar Tutor" }).click();
  await page.getByRole("textbox", { name: "Buscar por nome..." }).click();
  await page.getByRole("textbox", { name: "Buscar por nome..." }).fill("");
  await page.getByRole("button").nth(3).click();
  await page.getByRole("textbox", { name: "E-mail *" }).click();
  await page.getByRole("textbox", { name: "E-mail *" }).click();
  await page.getByRole("textbox", { name: "E-mail *" }).click();
  await page
    .getByRole("textbox", { name: "E-mail *" })
    .press("ControlOrMeta+ArrowLeft");
  await page
    .getByRole("textbox", { name: "E-mail *" })
    .press("ControlOrMeta+ArrowLeft");
  await page
    .getByRole("textbox", { name: "E-mail *" })
    .press("ControlOrMeta+ArrowLeft");
  await page
    .getByRole("textbox", { name: "E-mail *" })
    .press("ControlOrMeta+ArrowLeft");
  await page
    .getByRole("textbox", { name: "E-mail *" })
    .fill("maria.silva.editada@email.com");
  await page.getByRole("textbox", { name: "Senha", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Senha", exact: true })
    .fill("g@briel984gM");
  await page.getByRole("textbox", { name: "Senha", exact: true }).press("Tab");
  await page
    .getByRole("textbox", { name: "Confirmar Senha" })
    .fill("g@briel984gM");
  await page.getByRole("button", { name: "Salvar Alterações" }).click();
  await page.getByRole("textbox", { name: "email@exemplo.com" }).click();
  await page
    .getByRole("textbox", { name: "email@exemplo.com" })
    .fill("maria.silva.editada@email.com");
  await page.getByRole("textbox", { name: "email@exemplo.com" }).click();
  await page.getByRole("textbox", { name: "email@exemplo.com" }).click();
  await page.getByRole("textbox", { name: "email@exemplo.com" }).click();
  await page.getByRole("textbox", { name: "email@exemplo.com" }).click();
  await page.getByRole("textbox", { name: "email@exemplo.com" }).click();
  await page
    .getByRole("textbox", { name: "email@exemplo.com" })
    .fill("maria.silmail.com");
  await page.getByRole("textbox", { name: "email@exemplo.com" }).click();
  await page.getByRole("textbox", { name: "email@exemplo.com" }).fill("");
  await page.getByRole("button").nth(4).click();
  await page.getByRole("button", { name: "Remover" }).click();
});

test("Teste Pet", async ({ page }) => {
  await page.goto("http://localhost:8081/");
  await page.getByRole("link", { name: "Tutores" }).click();
  await page.getByRole("link", { name: "Pets" }).click();
  await page.getByRole("button", { name: "Novo Pet" }).click();
  await page.getByRole("textbox", { name: "Nome do Pet *" }).click();
  await page.getByRole("textbox", { name: "Nome do Pet *" }).fill("Miau");
  await page.getByRole("textbox", { name: "Nome do Pet *" }).press("Tab");
  await page.getByRole("combobox").filter({ hasText: "Cachorro" }).click();
  await page.getByLabel("Gato").getByText("Gato").click();
  await page.getByRole("textbox", { name: "Raça *" }).click();
  await page.getByRole("textbox", { name: "Raça *" }).fill("Vira Lata");
  await page.getByRole("combobox").filter({ hasText: "Macho" }).click();
  await page.getByLabel("Fêmea").getByText("Fêmea").click();
  await page
    .getByRole("textbox", { name: "Data de Nascimento *" })
    .fill("2020-02-05");
  await page.getByRole("textbox", { name: "Cor *" }).click();
  await page.getByRole("textbox", { name: "Cor *" }).fill("Rosa");
  await page.getByRole("spinbutton", { name: "Peso Atual (kg) *" }).dblclick();
  await page.getByRole("spinbutton", { name: "Peso Atual (kg) *" }).fill("15");
  await page
    .getByRole("combobox")
    .filter({ hasText: "Selecione o tutor" })
    .click();
  await page.getByLabel("Gabriel Tutor").getByText("Gabriel Tutor").click();
  await page.getByRole("textbox", { name: "Observações" }).click();
  await page.getByRole("textbox", { name: "Observações" }).fill("Muito Brava");
  await page.getByRole("button", { name: "Cadastrar" }).click();
  await page.getByRole("combobox").click();
  await page.getByText("Gato", { exact: true }).click();
  await page.getByRole("combobox").click();
  await page.getByText("Cachorro").click();
  await page.getByRole("combobox").click();
  await page.getByText("Coelho").click();
  await page.getByRole("combobox").click();
  await page.getByText("Todas as espécies").click();
  await page.getByRole("textbox", { name: "Buscar por nome..." }).click();
  await page.getByRole("textbox", { name: "Buscar por nome..." }).fill("");
  await page.getByRole("textbox", { name: "Nome do tutor..." }).click();
  await page.getByRole("textbox", { name: "Nome do tutor..." }).fill("");
  await page.getByRole("button", { name: "Editar" }).first().click();
  await page.getByRole("textbox", { name: "Cor *" }).dblclick();
  await page.getByRole("textbox", { name: "Cor *" }).fill("Verde");
  await page.getByRole("spinbutton", { name: "Peso Atual (kg) *" }).dblclick();
  await page.getByRole("spinbutton", { name: "Peso Atual (kg) *" }).fill("35");
  await page.getByRole("button", { name: "Atualizar" }).click();
  await page.getByRole("button", { name: "Excluir" }).first().click();
  await page.getByRole("button", { name: "Remover" }).click();
});
