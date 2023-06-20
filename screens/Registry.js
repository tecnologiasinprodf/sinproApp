import React from 'react';
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native';
import { useToast } from 'react-native-toast-notifications';

import Header from '../components/Header';
import Footer from '../components/Footer';
import FormTextInput from '../components/FormTextInput';
import FormPickerInput from '../components/FormPickerInput';
import FormListInput from '../components/FormListInput';
import FormDateInput from '../components/FormDateInput';
import { validateCPF } from '../core/util/utils';
import { useUser } from '../components/UserProvider';
import { API_TYPE, useHttp } from '../components/HttpProvider';

const Registry = () => {
  // Lists
  const [issuers, setIssuers] = React.useState([]);
  const [states, setStates] = React.useState([]);
  const [statuses, setStatuses] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);
  const [regionals, setRegionals] = React.useState([]);
  const [schools, setSchools] = React.useState([]);
  const [shifts, setShifts] = React.useState([]);
  const [genders] = React.useState([
    { id: 1, descricao: "Feminino" },
    { id: 2, descricao: "Masculino" }
  ]);

  // Properties
  const [loadingIssuers, setLoadingIssuers] = React.useState(true);
  const [loadingStates, setLoadingStates] = React.useState(true);
  const [loadingStatuses, setLoadingStatuses] = React.useState(true);
  const [loadingSubjects, setLoadingSubjects] = React.useState(true);
  const [loadingRegionals, setLoadingRegionals] = React.useState(true);
  const [loadingSchools, setLoadingSchools] = React.useState(true);
  const [loadingShifts, setLoadingShifts] = React.useState(true);
  const [loadingUser, setLoadingUser] = React.useState(true);
  const [name, setName] = React.useState('');
  const [mother, setMother] = React.useState('');
  const [father, setFather] = React.useState('');
  const [cpf, setCpf] = React.useState('');
  const [id, setId] = React.useState('');
  const [matsedf, setMatsedf] = React.useState('');
  const [issuer, setIssuer] = React.useState(null);
  const [issueState, setIssueState] = React.useState(null);
  const [issueDate, setIssueDate] = React.useState(new Date());
  const [birthDate, setBirthDate] = React.useState(new Date());
  const [status, setStatus] = React.useState(null);
  const [gender, setGender] = React.useState(genders[1]);
  const [nationality, setNationality] = React.useState('');
  const [birthPlace, setBirthPlace] = React.useState('');
  const [birthState, setBirthState] = React.useState(null);
  const [zip, setZip] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [district, setDistrict] = React.useState('');
  const [city, setCity] = React.useState('');
  const [addressState, setAddressState] = React.useState(null);
  const [emailList, setEmailList] = React.useState([]);
  const [phoneList, setPhoneList] = React.useState([]);
  const [subject, setSubject] = React.useState(null);
  const [regional, setRegional] = React.useState(null);
  const [school, setSchool] = React.useState(null);
  const [shift, setShift] = React.useState(null);
  const [tempContract, setTempContract] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date());
  const [retired, setRetired] = React.useState(false);
  const [retirementDate, setRetirementDate] = React.useState(new Date());
  const [userInfo, setUserInfo] = React.useState(null);
  const [showBtn, setShowBtn] = React.useState(false);

  // Hooks
  const toast = useToast();
  const { user } = useUser();
  const { get, post } = useHttp();

  React.useEffect(() => {
    get(API_TYPE.CADASTRO, 'orgaos.json').then(response => {
      setIssuers(validateResponse(response, "Órgão Emissor", true));
      setLoadingIssuers(false);
    }, error => {
      toast.show(error ? error : 'Erro desconhecido no serviço de Cadastro -> Órgão Emissor', {
        type: 'custom_error',
        data: { title: 'Erro no serviço de Órgão Emissor' }
      });
      setLoadingIssuers(false);
    });

    get(API_TYPE.CADASTRO, 'estados.json').then(response => {
      setStates(validateResponse(response, "Estado", true));
      setLoadingStates(false);
    }, error => {
      toast.show(error ? error : 'Erro desconhecido no serviço de Cadastro -> Estado', {
        type: 'custom_error',
        data: { title: 'Erro no serviço de Estado' }
      });
      setLoadingStates(false);
    });

    get(API_TYPE.CADASTRO, 'civis.json').then(response => {
      setStatuses(validateResponse(response, "Estado Civil", true));
      setLoadingStatuses(false);
    }, error => {
      toast.show(error ? error : 'Erro desconhecido no serviço de Cadastro -> Estado Civil', {
        type: 'custom_error',
        data: { title: 'Erro no serviço de Estado Civil' }
      });
      setLoadingStatuses(false);
    });

    get(API_TYPE.CADASTRO, 'disciplinas.json').then(response => {
      setSubjects(validateResponse(response, "Disciplina", true));
      setLoadingSubjects(false);
    }, error => {
      toast.show(error ? error : 'Erro desconhecido no serviço de Cadastro -> Disciplina', {
        type: 'custom_error',
        data: { title: 'Erro no serviço de Disciplina' }
      });
      setLoadingSubjects(false);
    });

    get(API_TYPE.CADASTRO, 'regionais.json').then(response => {
      setRegionals(validateResponse(response, "Regionais", true));
      setLoadingRegionals(false);
    }, error => {
      toast.show(error ? error : 'Erro desconhecido no serviço de Cadastro -> Regionais', {
        type: 'custom_error',
        data: { title: 'Erro no serviço de Regionais' }
      });
      setLoadingRegionals(false);
    });

    get(API_TYPE.CADASTRO, 'turnos.json').then(response => {
      setShifts(validateResponse(response, "Turnos", true));
      setLoadingShifts(false);
    }, error => {
      toast.show(error ? error : 'Erro desconhecido no serviço de Cadastro -> Turnos', {
        type: 'custom_error',
        data: { title: 'Erro no serviço de Turnos' }
      });
      setLoadingShifts(false);
    });

    get(API_TYPE.MONGO, 'cadastro/get/' + user.user.matricula).then(response => {
      if (!response || !response.rest || response.rest.error) {
        toast.show(response.rest.error || 'Nenhuma resposta retornada do serviço de cadastro de usuário', {
          type: 'custom_error',
          data: { title: 'Erro ao acessar as informações de alteração do usuário' }
        });
      } else if (response.rest.response) {
        setShowBtn(false);
      } else {
        setShowBtn(true);
        if (response.rest.success) {
          toast.show(response.rest.success, {
            type: 'custom_success',
            data: { title: 'Sucesso ao atualizar o cadastro do usuário' }
          });
        }
      }
    });
  }, []);

  React.useEffect(() => {
    if (regional?.id) {
      get(API_TYPE.CADASTRO, 'escolas.json?regional=' + regional.id).then(response => {
        setSchools(validateResponse(response, "Escola regional " + regional.descricao, true));
        setLoadingSchools(false);
      }, error => {
        toast.show(error ? error : 'Erro desconhecido no serviço de Cadastro -> Escolas para regional ' + regional.descricao, {
          type: 'custom_error',
          data: { title: 'Erro no serviço de Escolas' }
        });
        setLoadingSchools(false);
      });
    }
  }, [regional]);

  React.useEffect(() => {
    if (user?.user?.matricula) {
      get(API_TYPE.CADASTRO, 'associado.json?matricula=' + user.user.matricula).then(response => {
        setLoadingUser(false);
        const registry = validateResponse(response, "Associado", false);

        setUserInfo(registry);
        if (registry) {
          setName(registry.nome);
          setMother(registry.mae);
          setFather(registry.pai);
          setCpf(registry.cpf);
          setId(registry.rg);
          setMatsedf(registry.matsedf);
          setIssueDate(new Date(registry.data_expedicao_rg));
          setBirthDate(new Date(registry.data_nascimento));
          setGender(genders.find(x => x.id === +registry.sexos_id) ?? genders[0]);
          setNationality(registry.nacionalidade);
          setBirthPlace(registry.naturalidade);
          setZip(registry.cep);
          setAddress(registry.endereco);
          setDistrict(registry.bairro);
          setCity(registry.cidade);
          setEmailList(registry.emails ?? []);
          setPhoneList(registry.contatos ?? []);
          setTempContract(registry.autonomo);
          setStartDate(new Date(registry.data_admissao));
          setRetired(registry.aposentado);
          setRetirementDate(registry.data_aposentadoria ? new Date(registry.data_aposentadoria) : null);
        }
      }, error => {
        toast.show(error ? error : 'Erro desconhecido no serviço de Cadastro -> Associado', {
          type: 'custom_error',
          data: { title: 'Erro no serviço de Associados' }
        });
        setLoadingUser(false);
      });
    }
  }, [user]);

  React.useEffect(() => {
    if (issuers?.length && userInfo?.orgaos_id) {
      setIssuer(issuers.find(x => x.id === userInfo.orgaos_id));
    }
  }, [userInfo, issuers]);

  React.useEffect(() => {
    if (states?.length && userInfo?.uf_expedidor) {
      setIssueState(states.find(x => x.id === userInfo.uf_expedidor));
    }
    if (states?.length && userInfo?.uf_naturalidade) {
      setBirthState(states.find(x => x.id === userInfo.uf_naturalidade));
    }
    if (states?.length && userInfo?.uf_endereco) {
      setAddressState(states.find(x => x.id === userInfo.uf_endereco));
    }
  }, [userInfo, states]);

  React.useEffect(() => {
    if (states?.length && userInfo?.estados_civis_id) {
      setStatus(statuses.find(x => x.id === userInfo.estados_civis_id));
    }
  }, [userInfo, statuses]);

  React.useEffect(() => {
    if (subjects?.length && userInfo?.disciplina) {
      setSubject(subjects.find(x => x.id === userInfo.disciplina));
    }
  }, [userInfo, subjects]);

  React.useEffect(() => {
    if (regionals?.length && userInfo?.regional) {
      setRegional(regionals.find(x => x.id === userInfo.regional));
    }
  }, [userInfo, regionals]);

  React.useEffect(() => {
    if (shifts?.length && userInfo?.turno) {
      setShift(shifts.find(x => x.id === userInfo.turno));
    }
  }, [userInfo, shifts]);

  const validateResponse = (response, name, list) => {
    if (!response?.rest) {
      toast.show("O serviço de " + name + " não retornou informação.", {
        type: 'custom_error',
        data: { title: 'Erro no serviço de ' + name }
      });
      return [];
    } else if (response.rest.error) {
      toast.show(response.error, {
        type: 'custom_error',
        data: { title: 'Erro no serviço de ' + name }
      });
      return [];
    } else if (!response.rest.response || (list && !response.rest.response.length)) {
      toast.show("Nenhum registro de " + name + " cadastrado.", {
        type: 'custom_error',
        data: { title: "Registro de " + name + " não encontrado no cadastro" }
      });
      return [];
    }
    return response.rest.response;
  }

  const validateZip = (text) => {
    let v = text.replace(/\D/g,"");
    v = (v.length > 8) ? v.substring(0, 8) : v;
    v = v.replace(/(\d{2})(\d)/,"$1.$2");
    return v.replace(/(\d{3})(\d{1,3})/,"$1-$2");
  }

  const validatePhone = (phone) => {
    let v = phone.replace(/\D/g,"");
    v = (v.length > 12) ? v.substring(0, 11) : v;
    return v.replace(/(\d{2})(\d)/,"($1) $2");
  }

  const onRegionalChange = () => {
    setLoadingSchools(true);
  }
 
  const save = () => {
    const data = {
      aposentadoria: tempContract ? false : retired,
      autonomo: tempContract,
      bairro: district,
      cep: zip,
      cidade: city,
      cpf: cpf,
      data_admissao: startDate.toISOString().split('T')[0],
      data_aposentadoria: tempContract ? '' : (retirementDate ? retirementDate.toISOString().split('T')[0] : ''),
      data_aprovacao: null,
      data_atualizacao: (new Date()).toISOString(),
      data_expedicao_rg: issueDate.toISOString().split('T')[0],
      data_nascimento: birthDate.toISOString().split('T')[0],
      endereco: address,
      mae: mother,
      matricula: user.user.matricula,
      matsedf: tempContract ? 'AUTONOMO' : matsedf,
      nacionalidade: nationality,
      naturalidade: birthPlace,
      nome: name,
      pai: father,
      rg: id
    };
    let index = (new Date()).getTime() * 10;
    phoneList?.forEach(phone => {
      data['contato' + index] = phone;
      index++;
    });
    index = (new Date()).getTime() * 10;
    data.disciplina = subject.id;
    emailList?.forEach(email => {
      data['email' + index] = email;
      index++;
    });
    data.escola = school.id;
    data.estados_civis_id = status.id;
    data.orgaos_id = issuer.id;
    data.regional = regional.id;
    data.sexos_id = gender.id + '';
    data.turno = shift.id;
    data.uf_endereco = addressState.id;
    data.uf_expedidor = issueState.id;
    data.uf_naturalidade = birthState.id;

    setShowBtn(false);
    setLoadingUser(true);
    post(API_TYPE.MONGO, 'cadastro/atualizar', data).then(response => {
      setLoadingUser(false);
      if (!response || !response.rest || response.rest.error) {
        toast.show(response.rest.error || 'Nenhuma resposta do serviço de salvar cadastro de usuário', {
          type: 'custom_error',
          data: { title: 'Erro no serviço de salvar cadastro do usuário' }
        });
      } else {
        toast.show(response.rest.success, {
          type: 'custom_success',
          data: { title: 'Cadastro realizado com sucesso' }
        });
      }
    }).catch(error => {
      toast.show(error ? error : 'Erro desconhecido no serviço de Salvar Cadastro de Usuário', {
        type: 'custom_error',
        data: { title: 'Erro no serviço de Salvar Cadastro de Usuário' }
      });
    });
  }

  return (
    <View style={styles.container}>
      <Header title="Cadastro" />
      <ScrollView style={styles.content}>
        <View style={styles.formControl}>
          <Text style={styles.title}>Atualização de Cadastro</Text>
        </View>
        <FormTextInput label="Nome" value={name} setValue={setName} disabled={loadingUser} />
        <FormTextInput label="Mãe" value={mother} setValue={setMother} disabled={loadingUser} />
        <FormTextInput label="Pai" value={father} setValue={setFather} disabled={loadingUser} />
        <FormTextInput label="CPF" value={cpf} setValue={setCpf} validationFunction={validateCPF} keyboardType='numeric' 
          disabled={loadingUser} />
        <FormTextInput label="Identidade" value={id} setValue={setId} disabled={loadingUser} />
        <FormPickerInput label="Órgão emissor" value={issuer} setValue={setIssuer} valueList={issuers} 
          disabled={loadingUser || loadingIssuers} />
        <FormPickerInput label="Estado" value={issueState} setValue={setIssueState} valueList={states} 
          disabeld={loadingUser || loadingStates} />
        <FormDateInput label="Data de emissão" value={issueDate} setValue={setIssueDate} diabled={loadingUser} />
        <FormDateInput label="Data de nascimento" value={birthDate} setValue={setBirthDate} disabled={loadingUser} />
        <FormPickerInput label="Estado civil" value={status} setValue={setStatus} valueList={statuses} 
          disabled={loadingUser || loadingStatuses} />
        <FormPickerInput label="Gênero" value={gender} setValue={setGender} valueList={genders} disabled={loadingUser} />
        <FormTextInput label="Nacionalidade" value={nationality} setValue={setNationality} disabled={loadingUser} />
        <FormTextInput label="Naturalidade" value={birthPlace} setValue={setBirthPlace} disabled={loadingUser} />
        <FormPickerInput label="Estado" value={birthState} setValue={setBirthState} valueList={states} 
          disabled={loadingUser || loadingStates} />
        <FormTextInput label="CEP" value={zip} setValue={setZip} validationFunction={validateZip} disabled={loadingUser} />
        <FormTextInput label="Endereço" value={address} setValue={setAddress} disabled={loadingUser} />
        <FormTextInput label="Bairro" value={district} setValue={setDistrict} disabled={loadingUser} />
        <FormTextInput label="Cidade" value={city} setValue={setCity} disabled={loadingUser} />
        <FormPickerInput label="Estado" value={addressState} setValue={setAddressState} valueList={states} 
          disabled={loadingUser || loadingStates} />
        <FormListInput label="Email" addButtonLabel="Adicionar E-Mail" valueList={emailList} setValueList={setEmailList} 
          disabled={loadingUser} />
        <FormListInput label="Contato" addButtonLabel="Adicionar Contato" valueList={phoneList} setValueList={setPhoneList} 
          validationFunction={validatePhone} disabled={loadingUser} isPhone={true} />
        <FormPickerInput label="Disciplina" value={subject} setValue={setSubject} valueList={subjects} 
          disabled={loadingUser || loadingSubjects} />
        <FormPickerInput label="Regional" value={regional} setValue={setRegional} valueList={regionals} onValueChange={onRegionalChange}
          disabled={loadingUser || loadingRegionals} />
        <FormPickerInput label="Escola" value={school} setValue={setSchool} valueList={schools} 
          disabled={loadingUser || loadingSchools} />
        <FormPickerInput label="Turno" value={shift} setValue={setShift} valueList={shifts} disabled={loadingUser || loadingShifts} />
        <View style={styles.formControl}>
          <Text style={styles.label}>Contrato temporário</Text>
          <View style={styles.formSwitch}>
            <Switch onValueChange={() => setTempContract(!tempContract)} value={tempContract} disabled={loadingUser} />
          </View>
        </View>
        {!tempContract && <View>
          <Text style={styles.label}>Aposentado</Text>
          <View style={styles.formSwitch}>
            <Switch onValueChange={() => setRetired(!retired)} value={retired} disabled={loadingUser || tempContract} />
          </View>
        </View>}
        {!tempContract && retired && 
          <FormDateInput label="Data Aposentadoria" value={retirementDate} setValue={setRetirementDate} disabled={loadingUser || tempContract || retired} />
        }
        <FormDateInput label="Data de admissão" value={startDate} setValue={setStartDate} disabled={loadingUser} />
        {!tempContract && <FormTextInput label="Matrícula SEEDF" value={matsedf} setValue={setMatsedf} disabled={loadingUser} />}
      </ScrollView>
      { showBtn && <Button style={styles.button} title="Salvar" onPress={save} 
        disabled={loadingIssuers || loadingStates || loadingStatuses || loadingSubjects || loadingRegionals || 
          loadingSchools || loadingShifts ||loadingUser} />}
      {(loadingIssuers || loadingStates || loadingStatuses || loadingSubjects || loadingRegionals || 
        loadingSchools || loadingShifts ||loadingUser) && <View style={styles.spinner}>
          <ActivityIndicator size="large" color="red" />
      </View>}
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: 'white'
  },
  content: { },
  title: {
    fontSize: 28,
    color: "black"
  },
  formControl: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 10,
    marginRight: 10
  },
  label: {
    flex: 1,
    justifyContent: "center"
  },
  formSwitch: {
    flex: 3,
    alignItems: "flex-start"
  },
  spinner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {}
});

export default Registry;
