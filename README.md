# tcc-sensor
Este repositório descreve a parte do sensor do repositorio tcc_gsmart.
O sensor é um Raspberry Pi Model 3B com Kali Linux que detecta pessoas através de smartphones e redes sem fio pelo protocolo tshark.
O objetivo é a partir da detecção gerar um arquivo formato .csv que será enviado através de cURL para um servidor onde os dados
serão processados em dados estatísticos, como o tráfego de pessoas.

* https://github.com/caroljunq/tcc-webserver --> web server
* https://github.com/caroljunq/tcc-sensor --> sensor
* https://github.com/caroljunq/tcc_gsmart --> paper

## Tecnologias e ferramentas utilizadas
* Tshark
* cURL
* Raspberry Pi
* Modo Monitor
* Kali Linux

## Conceitos

### Modo Monitor
Normalmente, uma NIC (Network Interface Card - interface de rede) captura pacotes dos tipos managed e beacons que são originados por AP. Estes pacotes são transmitidos muitas vezes por segundo por APs para indicar quais redes estão realizando broadcasting. O modo monitor (monitor mode) é um modo de operação em que um NIC consegue capturar todos os tipos de pacotes sem estar associado a um AP. Dessa forma, é possível capturar todos os tipos, como os de probe request que são enviados de dispositivos móveis para pontos de acesso para saber quais redes próximas estão disponíveis para se conectar.

### Probe Request
Dispositivos emitem a cada intervalo de tempo pacotes do tipo probe request para detectar redes e/ou APs ao redor mesmo estando associado a um rede.  Todos os APs que receberem, responderão ao dispositivo (probe response ou received), então o aparelho descobrirá as redes ao redor disponíveis para conexão. O sensor detecta este tipo de pacote.

## Especificações Técnicas
* Raspberry Pi Model 3 B
* Antena Externa: Ralink MT601U


### Configuração do RPi


### Instalando pacotes
1- Instale o Tshark --> "apt-get install tshark";

2- Instale o net-tools --> "apt-get install net-tools";

3- Instale o curl --> "apt-get install curl"

4- Instale o curl --> "apt-get install git"

### Configuração de Inicialização
O Kali Linux possui tela para login e inicialização muito lenta, então é necessário configurá-lo para facilitar a execução dos scripts e tempo de detecção.

1- Vá até a o diretório/arquivo /etc/systemd/system/network-online-target/networking.service . Abra o arquivo e altere o campo TimeOutStartSec de 5min para 5sec . Esta configuração é para reduzir o tempo de boot.

2- Vá até o diretório /etc/lightdm/lightdm.conf . Tire # (comentário) das linhas autologin-user e autologin-timeout.
Coloque autologin-user=nomeusuario. Esta configuração é para realizar o autologin com o usuário desejado.

3- Vá até /etc/pam.d/lightdm-autologin e coloque # na frente da linha auth required pam_succeed_if.

### Conectando o dongle/antena Wifi
Desconecte o RPi da rede e coloque a o dongle Wifi que pode ser habilitado para o modo Monitor. Neste projeto, está sendo utilizado o modelo Ralink MT7601U.

### Habilitar modo Monitor
O adaptador Wifi precisa ter a capacidade de ser habilitado para o modo monitor. Para habilitá-lo, execute os comandos na ordem a seguir:

1- ifconfig wlan1 down //desliga a interface de rede que representa a antena;

2- iwconfig wlan1 mode monitor// coloca a interface no modo monitor;

3- ifconfig wlan1 up//liga a interface de rede.

### Rodando o Tshark
O tshark é um protocolo que auxilia na análise de pacotes capturados. Para detectar os pacotes provenientes de
dispositivos, o comando a ser rodado no terminal é:

tshark -i wlan1 -a duration:3600 -Y "wlan.fc.type_subtype eq 4" -T fields -e wlan.sa -e frame.time -E separator=- > output.txt

* -i --> interface
* wlan1 --> interface de captura
* wlan.fc.type_subtype eq 4 --> indica que pacotes do tipo probe request serão capturados
* wlan.sa --> é o source address (mac do emissor do pacote)
* frame.time --> instante em que o pacote é capturado
*  >output.csv --> exporta pacotes capturados para um arquivo .csv
* duratinon --> tempo de captura que o tshark roda

### Instalando No cURL
Para postar o arquivo .csv para o servidor, será necessário o curl. Para instalá-lo digite no terminal apt-get install curl.

### Instalando Nodejs
Para a futura aplicação será necessário o uso do Nodejs, para instalá-lo no terminal de comando digite:

1- sudo curl -sL https://deb.nodesource/setup_8.x | sudo -E bash -

2- sudo apt-get install -y nodejs

## Comando cURL
* curl -X POST -F "file=@pathfile" URL
* Dentro do node --> req.files.file.data.ToString();

## Configuração de serviços
### Atualizando hora
* 1- apt-get install ntp
* 2- Mude os servers de /etc/ntp para 0.br.pool.ntp.org até o 3.br.pool.ntp.org
* 3- Ligue o ntp como um serviço --> service ntp start

### Formatacao da Timezone
* 1- dpkg-reconfigure tzdata (selecione America/Sao_Paulo)
* 2- Mude arquivo /etc/timezone para America/Sao_Paulo (passo nao necessário)

### Mudando língua
* 1- Mude o arquivo /etc/default/locale para LANG="pt_BR.utf8";
* 2- No console, export LANG=pt_BR.utf8


## Instalação Node por NVM
* 1- curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash
* 2- export NVM_DIR="$HOME/.nvm"
     [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm  
    2a - export NVM_NODEJS_ORG_MIRROR=http://nodejs.org/dis
* 3- command -v nvm
* 4- nvm install node
* 5- nvm use node 
* Referências: https://github.com/creationix/nvm#install-script




## Links Tutoriais
- https://scotch.io/tutorials/how-to-host-a-node-js-app-on-digital-ocean
- https://www.digitalocean.com/community/tutorials/how-to-use-ssh-keys-with-digitalocean-droplets
