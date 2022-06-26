import { Container, Table, Content, LabelStyle, Form, Input, Button, ButtonIcon } from "./styles";
import { Header } from '../../components/Header'
import api from "../../services/api";
import { useEffect, useState } from "react";
import * as calc from "../../services/calculation";

interface Invoice {
  id: string;
  client: string;
  invoice: string;
  invoice_value: number;
  pis?: number;
  cofins?: number;
  csll?: number;
  iss?: number;
  liqNf?: number;
}

export function ListInvoice() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [client, setClient] = useState("");
  const [invoice, setInvoice] = useState("");
  const [invoiceValue, setInvoiceValue] = useState("");

  function getInvoices() {
    api({
      url: "invoice"
    })
    .then(res => {
      const newInvoices = res.data.map((invoice: Invoice) => {
        let newInvoice = {
          ...invoice,
          pis: calc.calculatePis(invoice.invoice_value),
          cofins: calc.calculateCofins(invoice.invoice_value),
          csll: calc.calculateCsll(invoice.invoice_value),
          iss: calc.calculateIss(invoice.invoice_value),
          liqNf: 0
        }
        
        newInvoice.liqNf = calc.calculateLiqNf(invoice.invoice_value ,newInvoice.pis ,newInvoice.cofins ,newInvoice.iss);
        return newInvoice;
      })
      setInvoices(newInvoices);
      console.log(invoices);
    })
  }

  function createInvoice(event: any) {
    event.preventDefault();

    api({
      method: "post",
      url: "invoice",
      data: {
        "client": client,
        "invoice": invoice,
        "invoice_value": invoiceValue
      }
    })
    .then(res => {
      let invoice = res.data;
      invoice = {
        ...invoice,
        pis: calc.calculatePis(invoice.invoice_value),
        cofins: calc.calculateCofins(invoice.invoice_value),
        csll: calc.calculateCsll(invoice.invoice_value),
        iss: calc.calculateIss(invoice.invoice_value),
        liqNf: 0
      }

      invoice.liqNf = calc.calculateLiqNf(invoice.invoice_value, invoice.pis, invoice.cofins, invoice.iss);

      setInvoices([...invoices, invoice]);
    })
  }

  function deleteInvoice(invoice: Invoice) {
    api({
      method: "delete",
      url: "invoice/" + invoice.id
    })
    .then(res => {
      const newInvoices = invoices.filter(e => e.id !== invoice.id);
      setInvoices(newInvoices);
    })
  }

  useEffect(() => {
    getInvoices();
  }, [])

  return (
    <Container>
      <Header title="Nova Nota Fiscal" /> 
      <Form onSubmit={createInvoice} >
        <Input placeholder="client" value={client} onChange={(event) => { setClient(event.target.value) }} />
        <Input placeholder="invoice" value={invoice} onChange={(event) => { setInvoice(event.target.value) }} />
        <Input placeholder="invoice_value" value={invoiceValue} onChange={(event) => { setInvoiceValue(event.target.value) }} type="number" />

        <Button type="submit" >Salvar</Button>
      </Form>

      <Header title="Totais" /> 
      <Content>
        <LabelStyle>Total do Valor da Nota Fiscal: R$ { calc.calculateTotalNf(invoices) } </LabelStyle>

        <LabelStyle>Total do Valor do Pis: R$ { calc.calculateTotalPis(invoices) } </LabelStyle>

        <LabelStyle>Total do Valor do Cofins: R$ { calc.calculateTotalCofins(invoices) } </LabelStyle>

        <LabelStyle>Total do Valor do Csll: R$ { calc.calculateTotalCsll(invoices) } </LabelStyle>

        <LabelStyle>Total do Valor do Iss: R$ { calc.calculateTotalIss(invoices) } </LabelStyle>

        <LabelStyle>Total do Valor do Liquido da NF: R$ { calc.calculateTotalLiqNf(invoices) } </LabelStyle>
      </Content>

      <Header title="Listagem de Notas Fiscais" />
      <Table>
        <thead>
          <tr>
            <th>Nota Fiscal</th>
            <th>Cliente</th>
            <th>Valor da NF</th>
            <th>Valor Pis</th>
            <th>Valor Cofins</th>
            <th>Valor Csll</th>
            <th>Valor Iss</th>
            <th>Valor Liq NF</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => 
            (<tr key={invoice.id} >
              <td>{invoice.invoice}</td>
              <td>{invoice.client}</td>
              <td>R$ {invoice.invoice_value}</td>
              <td>R$ {invoice.pis}</td>
              <td>R$ {invoice.cofins}</td>
              <td>R$ {invoice.csll}</td>
              <td>R$ {invoice.iss}</td>
              <td>R$ {invoice.liqNf}</td>
            <td><Button type="button" onClick={() => deleteInvoice(invoice)} >Deletar</Button></td>
            </tr>)
          )}
        </tbody>
      </Table>

    </Container>
  )
}